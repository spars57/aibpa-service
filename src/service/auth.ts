import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as jwt from 'jwt-simple'
import BaseService from 'src/classes/base-service'
import AccessTokenRepository from 'src/respository/access-token'
import UserRepository from 'src/respository/user'
import { AccessToken } from 'src/types/access-token'
import { User } from 'src/types/user'
import { v4 } from 'uuid'

@Injectable()
class AuthService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {
    super(AuthService.name)
  }

  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  public async login(name: User['name'], password: User['password']) {
    const user = (await this.validateIfUserExists(name, true)) as User
    await this.validatePassword(user!, password)
    return await this.generateToken(user!)
  }

  public async logout(uuid: User['uuid']) {
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) {
      this.logger.error(`User with uuid ${uuid} not found`)
      throw new HttpException(`User with uuid ${uuid} not found`, HttpStatus.NOT_FOUND)
    }

    const accessToken = await this.accessTokenRepository.findByUserUuid(user.uuid)

    if (!accessToken) {
      this.logger.error(`Access token with user uuid ${user.uuid} not found`)
      throw new HttpException(`Access token with user uuid ${user.uuid} not found`, HttpStatus.NOT_FOUND)
    }

    await this.accessTokenRepository.delete(accessToken.uuid, user.uuid)
    return
  }

  public async register(name: User['name'], password: User['password'], email: User['email']) {
    await this.validateEmail(email, true)
    const hashedPassword = await this.hashPassword(password)
    const newUser = await this.userRepository.create(name, hashedPassword, email)
    return newUser
  }

  // ------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------

  private async validateIfUserExists(name: User['name'], throwError: boolean = true): Promise<User | null> {
    const errorMessage = `User with username ${name} not found`
    const user = await this.userRepository.getByName(name)
    if (!user && throwError) {
      this.logger.error(errorMessage)
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND)
    }
    return user
  }

  private async validatePassword(user: User, password: User['password']): Promise<void> {
    const hashedPassword = await this.hashPassword(password)
    const errorMessage = `Invalid password for user ${user.name}`
    const isPasswordValid = await this.encrypt.compare(hashedPassword, user.password)
    if (!isPasswordValid) {
      this.logger.error(errorMessage)
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED)
    }
  }

  private async validateEmail(email: User['email'], throwError: boolean = true) {
    const errorMessage = `User with email ${email} already exists`
    const user = await this.userRepository.getByEmail(email)
    if (user && throwError) {
      this.logger.error(errorMessage)
      throw new HttpException(errorMessage, HttpStatus.CONFLICT)
    }
  }

  private async hashPassword(password: string) {
    return this.encrypt.encrypt(password)
  }

  private async generateToken(user: User) {
    const accessTokenUuid = v4()
    const refreshTokenUuid = v4()

    const accessTokenPayload: AccessToken = {
      uuid: accessTokenUuid,
      user_uuid: user.uuid,
      valid_from: Date.now(),
      valid_until: Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD')),
      type: 'access',
    }

    const refreshTokenPayload: AccessToken = {
      uuid: refreshTokenUuid,
      user_uuid: user.uuid,
      valid_from: Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD')),
      valid_until: Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD')) * 2,
      type: 'refresh',
    }

    const jwtAccessToken = jwt.encode(accessTokenPayload, this.env.get('JWT_SECRET'))

    const jwtRefreshToken = jwt.encode(refreshTokenPayload, this.env.get('JWT_SECRET'))

    const accessToken = await this.accessTokenRepository.create({
      uuid: accessTokenPayload.uuid,
      user_uuid: user.uuid,
      value: jwtAccessToken,
    })

    const refreshToken = await this.accessTokenRepository.create({
      uuid: refreshTokenPayload.uuid,
      user_uuid: user.uuid,
      value: jwtRefreshToken,
    })

    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
    }
  }

  private async decodeToken(token: string) {
    const decoded = jwt.decode(token, this.env.get('JWT_SECRET')) as any
    return decoded as AccessToken
  }

  private async validateToken(token: string) {
    const decoded = await this.decodeToken(token)
    this.logger.log(decoded)
    return false
  }
}

export default AuthService
