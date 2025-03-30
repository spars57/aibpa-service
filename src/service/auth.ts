import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AccessToken, User } from '@prisma/client'
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
  /**
   * Logs in a user
   * @param body The login request body
   * @returns The access token
   * @throws HttpException if the email or password is invalid
   */
  public async login(body: LoginRequest): Promise<AccessTokenResponse | null> {
    await this.validateLoginRequest(body)

    const user = await this.userRepository.getByEmail(body.email)

    if (!user) {
      const userNotFoundMessage = `User with email "${body.email}" not found`
      this.logger.error(userNotFoundMessage)
      throw new HttpException(userNotFoundMessage, HttpStatus.NOT_FOUND)
    }

    const hashedPassword = await this.encrypt.encrypt(body.password)
    const passwordsMatch = await this.encrypt.compare(hashedPassword, user.password)

    if (!passwordsMatch) {
      const invalidPasswordMessage = `Incorrect password or email`
      this.logger.error(invalidPasswordMessage)
      throw new HttpException(invalidPasswordMessage, HttpStatus.UNAUTHORIZED)
    }

    const accessTokenUuid = v4()

    const accessTokenValue = await this.jwt.generate({
      uuid: accessTokenUuid,
      userUuid: user.uuid,
    })

    const accessToken: AccessToken = {
      uuid: accessTokenUuid,
      user_uuid: user.uuid,
      expires_at: new Date(Date.now() + Number(this.env.get('JWT_VALIDITY_PERIOD'))),
      value: accessTokenValue,
    } as AccessToken

    const dbAccessToken = await this.accessTokenRepository.create(accessToken)
    this.logger.verbose(dbAccessToken)

    return { accessToken: accessTokenValue }
  }
  /**
   * Validates the login request
   * @param body The login request body
   * @throws HttpException if the request is invalid
   */
  private async validateLoginRequest(body: LoginRequest) {
    if (!body.email) {
      this.logger.error('Email is required')
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.password) {
      this.logger.error('Password is required')
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST)
    }
  }
  /**
   * Registers a new user
   * @param body The register request body
   * @returns The created user
   * @throws HttpException if the request is invalid
   */
  public async register(body: RegisterRequest) {
    await this.validateRegisterRequest(body)
    return await this.buildUserFromRegisterRequest(body).then((user) => this.userRepository.create(user))
  }
  /**
   * Validates the register request
   * @param body The register request body
   * @throws HttpException if the request is invalid
   */
  private async validateRegisterRequest(body: RegisterRequest) {
    if (!body.email) {
      this.logger.error('Email is required')
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.password) {
      this.logger.error('Password is required')
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.username) {
      this.logger.error('Username is required')
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.firstName) {
      this.logger.error('First name is required')
      throw new HttpException('First name is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.lastName) {
      this.logger.error('Last name is required')
      throw new HttpException('Last name is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.city) {
      this.logger.error('City is required')
      throw new HttpException('City is required', HttpStatus.BAD_REQUEST)
    }

    if (!body.country) {
      this.logger.error('Country is required')
      throw new HttpException('Country is required', HttpStatus.BAD_REQUEST)
    }

    const userByEmail = await this.userRepository.getByEmail(body.email)
    const userByUsername = await this.userRepository.getByName(body.username)

    if (userByEmail) {
      const userAlreadyExistsMessage = `User with email "${body.email}" already exists.`
      this.logger.error(userAlreadyExistsMessage)
      throw new HttpException(userAlreadyExistsMessage, HttpStatus.CONFLICT)
    }

    if (userByUsername) {
      const userAlreadyExistsMessage = `User with username "${body.username}" already exists.`
      this.logger.error(userAlreadyExistsMessage)
      throw new HttpException(userAlreadyExistsMessage, HttpStatus.CONFLICT)
    }
  }
  /**
   * Builds a user from the register request
   * @param body The register request body
   * @returns The created user
   */
  private async buildUserFromRegisterRequest(body: RegisterRequest): Promise<User> {
    const hashedPassword = await this.encrypt.encrypt(body.password)
    return {
      email: body.email,
      password: hashedPassword,
      uuid: v4(),
      created_at: new Date(),
      updated_at: new Date(),
      username: body.username,
      city: body.city,
      country: body.country,
      first_name: body.firstName,
      last_name: body.lastName,
    } as User
  }
  /**
   * Logs out a user
   * @param req The request object
   * @returns The logout response
   */
  public async logout(req: Request) {
    const jwtToken = req.headers?.['authorization']?.split(' ')[1]

    if (!jwtToken) {
      const noTokenMessage = 'No token provided'
      this.logger.error(noTokenMessage)
      throw new HttpException(noTokenMessage, HttpStatus.UNAUTHORIZED)
    }

    const accessToken = await this.jwt.decode<{ uuid: AccessToken['uuid']; userUuid: User['uuid'] }>(jwtToken!)

    const user = await this.userRepository.getByUuid(accessToken.userUuid)

    if (!user) {
      const userNotFoundMessage = `User with uuid "${accessToken.userUuid}" not found`
      this.logger.error(userNotFoundMessage)
      throw new HttpException(userNotFoundMessage, HttpStatus.NOT_FOUND)
    }

    const dbAccessToken = await this.accessTokenRepository.findByUuid(accessToken.uuid)

    if (!dbAccessToken) {
      const accessTokenNotFoundMessage = `Access token with uuid "${accessToken.uuid}" not found`
      this.logger.error(accessTokenNotFoundMessage)
      throw new HttpException(accessTokenNotFoundMessage, HttpStatus.NOT_FOUND)
    }

    if (dbAccessToken.user_uuid !== user.uuid) {
      const accessTokenNotFoundMessage = `Access token with uuid "${accessToken.uuid}" not found`
      this.logger.error(accessTokenNotFoundMessage)
      throw new HttpException(accessTokenNotFoundMessage, HttpStatus.NOT_FOUND)
    }

    return this.accessTokenRepository.delete(accessToken.uuid, user.uuid)
  }
}
export default AuthService
