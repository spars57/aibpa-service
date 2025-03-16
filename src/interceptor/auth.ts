import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import * as jwt from 'jwt-simple'
import Environment from 'src/classes/env'
import AccessTokenRepository from 'src/respository/access-token'
import { AccessToken } from 'src/types/access-token'

@Injectable()
class AuthInterceptor implements NestInterceptor {
  private readonly logger: Logger
  private readonly env: Environment

  constructor(private readonly accessTokenRepository: AccessTokenRepository) {
    this.logger = new Logger(AuthInterceptor.name)
    this.env = new Environment()
  }

  public async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest()
    this.validateRequestHeaders(request)

    const requestToken = this.extractTokenFromRequestHeaders(request)
    this.checkTokenType(requestToken)

    const jwtToken = this.extractJwtTokenFromRequestToken(requestToken)
    const decodeJwtToken = await this.decodeJwtToken(jwtToken)

    this.checkIfTokenStructureRespectsDatabase(decodeJwtToken)

    const { value } = await this.getTokenFromDatabase(decodeJwtToken.uuid)
    const decodedToken = await this.decodeJwtToken(value)

    this.validateTokenExpiration(decodedToken)
    this.validateTokenNotYetValid(decodedToken)

    return next.handle()
  }

  private checkIfTokenStructureRespectsDatabase(token: Record<string, unknown>): token is AccessToken {
    const invalidTokenStructureErrorMessage = 'Invalid token structure'
    const keys: (keyof AccessToken)[] = ['uuid', 'user_uuid', 'valid_from', 'valid_until', 'type']

    for (const key of keys) {
      if (!token[key]) {
        this.logger.error(invalidTokenStructureErrorMessage)
        throw new HttpException(invalidTokenStructureErrorMessage, HttpStatus.UNAUTHORIZED)
      }
    }
    return true
  }
  private checkTokenType(token: string) {
    const notABaererTokenErrorMessage = 'Invalid token, expected a Bearer token'
    if (!token.includes('Bearer ')) {
      this.logger.error(notABaererTokenErrorMessage)
      throw new HttpException(notABaererTokenErrorMessage, HttpStatus.UNAUTHORIZED)
    }
  }

  private validateRequestHeaders(request: any) {
    const tokenErrorMessage = 'No token provided'

    if (!request.headers['authorization']) {
      this.logger.error(tokenErrorMessage)
      throw new HttpException(tokenErrorMessage, HttpStatus.UNAUTHORIZED)
    }
  }

  private extractTokenFromRequestHeaders(request: any) {
    return request.headers['authorization']
  }

  private extractJwtTokenFromRequestToken(requestToken: string) {
    return requestToken.split(' ')[1]
  }

  private async decodeJwtToken(jwtToken: string) {
    return jwt.decode(jwtToken, this.env.get('JWT_SECRET'))
  }

  private async getTokenFromDatabase(uuid: string) {
    const token = await this.accessTokenRepository.findByUuid(uuid)
    if (!token) {
      this.logger.error('Token not found on database')
      throw new HttpException('Token not found', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return token
  }

  private validateTokenExpiration(token: AccessToken) {
    if (token.valid_until < Date.now()) {
      this.logger.error('Token expired')
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)
    }
  }

  private validateTokenNotYetValid(token: AccessToken) {
    if (token.valid_from > Date.now()) {
      this.logger.error('Token not yet valid')
      throw new HttpException('Token not yet valid', HttpStatus.UNAUTHORIZED)
    }
  }
}

export default AuthInterceptor
