import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AccessToken, User } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import { EnvironmentKeysEnum } from 'src/classes/env'
import { AuthenticationErrorMessages } from 'src/controller/authentication/messages'
import AccessTokenRepository from 'src/repository/access-token'
import UserRepository from 'src/repository/user'
import LoginRequest from 'src/types/request/auth/login'
import RegisterRequest from 'src/types/request/auth/register'
import LoginResponse from 'src/types/response/auth/login'
import RegisterResponse from 'src/types/response/auth/register'
import { v4 } from 'uuid'

@Injectable()
class AuthenticationService extends BaseService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accessTokenRepository: AccessTokenRepository,
  ) {
    super(AuthenticationService.name)
  }
  /**
   * Logs in a user
   * @param request The login request body
   * @returns The access token
   * @throws HttpException if the email or password is invalid
   */
  public async login(request: LoginRequest): Promise<LoginResponse> {
    await this.validateLoginRequest(request)
    const accessTokenUuid = v4()
    const user = await this.userRepository.getByEmail(request.getEmail())

    if (!user) {
      this.logger.error(AuthenticationErrorMessages.UserNotFound)
      throw new HttpException(AuthenticationErrorMessages.UserNotFound, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const hashedPassword = await this.encrypt.encrypt(request.getPassword())
    const passwordsMatch = await this.encrypt.compare(hashedPassword, user.password)

    if (!passwordsMatch) {
      this.logger.error(AuthenticationErrorMessages.InvalidCredentials)
      throw new HttpException(AuthenticationErrorMessages.InvalidCredentials, HttpStatus.UNAUTHORIZED)
    }

    const accessTokenValue = await this.jwt.generate({
      uuid: accessTokenUuid,
      userUuid: user.uuid,
    })

    const accessToken: AccessToken = {
      uuid: accessTokenUuid,
      user_uuid: user.uuid,
      expires_at: new Date(Date.now() + Number(this.env.get(EnvironmentKeysEnum.JWT_VALIDITY_PERIOD))),
      value: accessTokenValue,
    } as AccessToken

    await this.accessTokenRepository.create(accessToken)

    return new LoginResponse(accessTokenValue)
  }
  /**
   * Validates the login request
   * @param request The login request body
   * @throws HttpException if the request is invalid
   */
  private async validateLoginRequest(request: LoginRequest) {
    if (!request.getEmail()) {
      this.logger.error(AuthenticationErrorMessages.LoginBadRequest)
      throw new HttpException(AuthenticationErrorMessages.LoginBadRequest, HttpStatus.BAD_REQUEST)
    }

    if (!request.getPassword()) {
      this.logger.error(AuthenticationErrorMessages.LoginBadRequest)
      throw new HttpException(AuthenticationErrorMessages.LoginBadRequest, HttpStatus.BAD_REQUEST)
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
    const user = await this.buildUserFromRegisterRequest(body, v4()).then((user) => this.userRepository.create(user))
    return new RegisterResponse(user)
  }
  /**
   * Validates the register request
   * @param request The register request body
   * @throws HttpException if the request is invalid
   */
  private async validateRegisterRequest(request: RegisterRequest) {
    if (!request.validate()) {
      this.logger.error('Invalid request')
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST)
    }

    const userByEmail = await this.userRepository.getByEmail(request.getEmail())
    const userByUsername = await this.userRepository.getByName(request.getUsername())

    if (userByEmail) {
      const userAlreadyExistsMessage = `User with email "${request.getEmail()}" already exists.`
      this.logger.error(userAlreadyExistsMessage)
      throw new HttpException(userAlreadyExistsMessage, HttpStatus.CONFLICT)
    }

    if (userByUsername) {
      const userAlreadyExistsMessage = `User with username "${request.getUsername()}" already exists.`
      this.logger.error(userAlreadyExistsMessage)
      throw new HttpException(userAlreadyExistsMessage, HttpStatus.CONFLICT)
    }
  }
  /**
   * Builds a user from the register request
   * @param request The register request body
   * @returns The created user
   */
  private async buildUserFromRegisterRequest(request: RegisterRequest, uuid?: string): Promise<User> {
    const hashedPassword = await this.encrypt.encrypt(request.getPassword())
    return {
      email: request.getEmail(),
      password: hashedPassword,
      uuid: uuid ?? v4(),
      created_at: new Date(),
      updated_at: new Date(),
      username: request.getUsername(),
      city: request.getCity(),
      country: request.getCountry(),
      first_name: request.getFirstName(),
      last_name: request.getLastName(),
    } as User
  }
  /**
   * Logs out a user
   * @param request The request object
   * @returns The logout response
   */
  public async logout(request: Request) {
    const jwtToken = request.headers?.['authorization']?.split(' ')[1]

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
export default AuthenticationService
