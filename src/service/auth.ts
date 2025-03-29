import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import AccessTokenRepository from 'src/respository/access-token'
import UserRepository from 'src/respository/user'
import LoginRequest from 'src/types/request/login'
import RegisterRequest from 'src/types/request/register'
import { AccessTokenResponse } from 'src/types/response/access-token'
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

  /**
   * Logs in a user
   * @param body The login request body
   * @returns The access token
   * @throws HttpException if the email or password is invalid
   */
  public async login(body: LoginRequest): Promise<AccessTokenResponse | null> {
    const { email, password } = body

    if (!email || !password) {
      const emailAndPasswordRequiredMessage = 'Email and password are required'
      this.logger.error(emailAndPasswordRequiredMessage)
      throw new HttpException(emailAndPasswordRequiredMessage, HttpStatus.BAD_REQUEST)
    }

    const user = await this.userRepository.getByEmail(email)

    if (!user) {
      const userNotFoundMessage = `User with email "${email}" not found`
      this.logger.error(userNotFoundMessage)
      throw new HttpException(userNotFoundMessage, HttpStatus.NOT_FOUND)
    }

    const hashedPassword = await this.encrypt.encrypt(password)
    const passwordsMatch = await this.encrypt.compare(hashedPassword, user.password)

    if (!passwordsMatch) {
      const invalidPasswordMessage = `Incorrect password or email`
      this.logger.error(invalidPasswordMessage)
      throw new HttpException(invalidPasswordMessage, HttpStatus.UNAUTHORIZED)
    }

    const accessToken = await this.jwt.generate({
      uuid: user.uuid,
      email: user.email,
      username: user.username,
    })

    return { accessToken }
  }

  public async register(body: RegisterRequest) {
    if (!body.email || !body.password) {
      this.logger.error('Email and password are required')
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST)
    }

    const user = await this.userRepository.getByEmail(body.email)

    if (user) {
      this.logger.error(`User with email ${body.email} already exists`)
      throw new HttpException(`User with email ${body.email} already exists`, HttpStatus.CONFLICT)
    }

    const payload = await this.buildUserFromRegisterRequest(body)

    return await this.userRepository.create(payload)
  }

  private async buildUserFromRegisterRequest(body: RegisterRequest): Promise<User> {
    const hashedPassword = await this.encrypt.encrypt(body.password)
    return {
      id: 0,
      email: body.email,
      password: hashedPassword,
      uuid: v4(),
      created_at: new Date(),
      deleted: false,
      updated_at: new Date(),
      username: body.username,
      city: body.city,
      country: body.country,
      first_name: body.firstName,
      last_name: body.lastName,
    }
  }

  // public async logout(uuid: User['uuid']) {
  //   const user = await this.userRepository.getByUuid(uuid)
  //   if (!user) {
  //     this.logger.error(`User with uuid ${uuid} not found`)
  //     throw new HttpException(`User with uuid ${uuid} not found`, HttpStatus.NOT_FOUND)
  //   }

  //   const accessToken = await this.accessTokenRepository.findByUserUuid(user.uuid)

  //   if (!accessToken) {
  //     this.logger.error(`Access token with user uuid ${user.uuid} not found`)
  //     throw new HttpException(`Access token with user uuid ${user.uuid} not found`, HttpStatus.NOT_FOUND)
  //   }

  //   await this.accessTokenRepository.delete(accessToken.uuid, user.uuid)
  //   return
  // }

  // public async register(username: User['username'], password: User['password'], email: User['email']) {
  //   await this.validateEmail(email, true)
  //   const hashedPassword = await this.hashPassword(password)
  //   const newUser = await this.userRepository.create(username, hashedPassword, email)
  //   return newUser
  // }

  // // ------------------------------------------------------------
  // // Private methods
  // // ------------------------------------------------------------

  // private async validateIfUserExists(username: User['username'], throwError: boolean = true): Promise<User | null> {
  //   const errorMessage = `User with username "${username}" not found`
  //   const user = await this.userRepository.getByName(username)

  //   const isDefined = Object.values(user ?? {}).every((value) => value !== null && value !== undefined)

  //   if (!isDefined && throwError) {
  //     this.logger.error(errorMessage)
  //     throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST)
  //   }
  //   return user
  // }

  // private async validatePassword(user: User, password: User['password']): Promise<void> {
  //   const hashedPassword = await this.hashPassword(password)
  //   const errorMessage = `Invalid password for user "${user.username}"`
  //   const isPasswordValid = await this.encrypt.compare(hashedPassword, user.password)
  //   if (!isPasswordValid) {
  //     this.logger.error(errorMessage)
  //     throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED)
  //   }
  // }

  // private async validateEmail(email: User['email'], throwError: boolean = true) {
  //   const errorMessage = `User with email ${email} already exists`
  //   const user = await this.userRepository.getByEmail(email)
  //   if (user && throwError) {
  //     this.logger.error(errorMessage)
  //     throw new HttpException(errorMessage, HttpStatus.CONFLICT)
  //   }
  // }

  // private async hashPassword(password: string) {
  //   return this.encrypt.encrypt(password)
  // }

  // private buildAccessTokenPayload(user: User) {
  //   return {
  //     uuid: v4(),
  //     user_uuid: user.uuid,
  //     valid_from: Date.now(),
  //   }
  // }

  // private async generateToken(user: User) {
  //   const accessTokenUuid = v4()
  //   const refreshTokenUuid = v4()

  //   const accessTokenPayload: InternalAccessToken = {
  //     uuid: accessTokenUuid,
  //     user_uuid: user.uuid,
  //     expires_at: Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD')),
  //   }

  //   const refreshTokenPayload: InternalAccessToken = {
  //     uuid: refreshTokenUuid,
  //     user_uuid: user.uuid,
  //     expires_at: Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD')) * 2,
  //   }

  //   const jwtAccessToken = jwt.encode(accessTokenPayload, this.env.get('JWT_SECRET'))

  //   const jwtRefreshToken = jwt.encode(refreshTokenPayload, this.env.get('JWT_SECRET'))

  //   const accessToken = await this.accessTokenRepository.create({
  //     uuid: accessTokenPayload.uuid,
  //     user_uuid: user.uuid,
  //     deleted: false,
  //     expires_at: accessTokenPayload.expires_at,
  //   })

  //   return {
  //     accessToken: accessToken.value,
  //   }
  // }

  // private async decodeToken(token: string) {
  //   const decoded = jwt.decode(token, this.env.get('JWT_SECRET')) as any
  //   return decoded as InternalAccessToken
  // }

  // private async validateToken(token: string) {
  //   const decoded = await this.decodeToken(token)
  //   this.logger.log(decoded)
  //   return false
  // }
}

export default AuthService
