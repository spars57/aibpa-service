import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { AccessToken } from '@prisma/client'
import * as jwt from 'jwt-simple'
import Environment from 'src/classes/env'
import AccessTokenRepository from 'src/respository/access-token'
import { InternalAccessToken } from 'src/types/dto/access-token'

@Injectable()
/**
 * Interceptor to validate the authorization to certain routes
 */
class AuthInterceptor implements NestInterceptor {
  private readonly logger: Logger
  private readonly env: Environment

  constructor(private readonly accessTokenRepository: AccessTokenRepository) {
    this.logger = new Logger(AuthInterceptor.name)
    this.env = new Environment()
  }
  // ------------------------------------------------------------
  // Public methods
  // ------------------------------------------------------------

  public async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    this.validateRequestHeaders(request)

    const requestToken = this.extractTokenFromRequestHeaders(request)
    this.checkTokenType(requestToken)

    const jwtToken = this.extractJwtTokenFromRequestToken(requestToken)
    const decodeJwtToken = await this.decodeJwtToken(jwtToken)

    this.checkIfTokenStructureRespectsDatabase(decodeJwtToken)

    const accessToken = await this.getTokenFromDatabase(decodeJwtToken.uuid)

    this.validateTokenExpiration(accessToken)

    return next.handle()
  }

  // ------------------------------------------------------------
  // Private methods
  // ------------------------------------------------------------

  /**
   * Check if the token structure respects the database structure
   * @param token - The token to check
   * @returns true if the token structure is valid, false otherwise
   */
  private checkIfTokenStructureRespectsDatabase(token: Record<string, unknown>): token is InternalAccessToken {
    const invalidTokenStructureErrorMessage = 'Invalid token structure'
    const keys: (keyof InternalAccessToken)[] = ['userUuid', 'uuid']

    this.logger.log('Checking if token structure respects database', token)

    const tokenKeys = Object.keys(token)

    for (const key of keys) {
      if (!tokenKeys.includes(key)) {
        this.logger.error(invalidTokenStructureErrorMessage)
        throw new HttpException(invalidTokenStructureErrorMessage, HttpStatus.UNAUTHORIZED)
      }
    }
    return true
  }

  /**
   * Check if the token type is Bearer
   * @param token - The token to check
   * @returns true if the token type is valid, false otherwise
   */
  private checkTokenType(token: string) {
    const notABaererTokenErrorMessage = 'Invalid token, expected a Bearer token'
    if (!token.includes('Bearer ')) {
      this.logger.error(notABaererTokenErrorMessage)
      throw new HttpException(notABaererTokenErrorMessage, HttpStatus.UNAUTHORIZED)
    }
  }

  /**
   * Check if the request headers contain an authorization header
   * @param request - The request to check
   * @returns true if the request headers contain an authorization header, false otherwise
   */
  private validateRequestHeaders(request: any) {
    this.logger.log('Validating request headers')
    const tokenErrorMessage = 'No token provided'

    if (!request.headers['authorization']) {
      this.logger.error(tokenErrorMessage)
      throw new HttpException(tokenErrorMessage, HttpStatus.UNAUTHORIZED)
    }
  }

  /**
   * Extract the token from the request headers
   * @param request - The request to extract the token from
   * @returns the token
   */
  private extractTokenFromRequestHeaders(request: any) {
    this.logger.log('Extracting token from request headers')
    return request.headers['authorization']
  }

  /**
   * Extract the JWT token from the request token
   * @param requestToken - The request token to extract the JWT token from
   * @returns the JWT token
   */
  private extractJwtTokenFromRequestToken(requestToken: string) {
    this.logger.log('Extracting JWT token from request token')
    return requestToken.split(' ')[1]
  }

  /**
   * Decode the JWT token
   * @param jwtToken - The JWT token to decode
   * @returns the decoded JWT token
   */
  private async decodeJwtToken(jwtToken: string) {
    this.logger.log('Decoding JWT token')
    return jwt.decode(jwtToken, this.env.get('JWT_SECRET'))
  }

  /**
   * Get the token from the database
   * @param uuid - The UUID of the token to get
   * @returns the token
   */
  private async getTokenFromDatabase(uuid: string) {
    this.logger.log('Getting token from database')
    const token = await this.accessTokenRepository.findByUuid(uuid)
    if (!token) {
      this.logger.error('Token not found on database')
      throw new HttpException('Token not found', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return token
  }

  /**
   * Validate the token expiration
   * @param token - The token to validate
   * @returns true if the token is valid, false otherwise
   */
  private validateTokenExpiration(token: AccessToken) {
    this.logger.log('Validating token expiration')
    if (token.expires_at < new Date()) {
      this.logger.error('Token expired')
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)
    }
  }
}

export default AuthInterceptor
