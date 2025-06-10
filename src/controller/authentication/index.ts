import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import BaseController from 'src/classes/base-controller'
import AuthenticationService from 'src/service/authentication'
import LoginRequest from 'src/types/request/auth/login'
import RegisterRequest from 'src/types/request/auth/register'
import * as Decorators from './decorators'

@Controller('authentication')
class AuthenticationController extends BaseController {
  constructor(private readonly authenticationService: AuthenticationService) {
    super(AuthenticationController.name)
  }

  /**
   * Logs in a user
   * @param request The login request body
   * @returns The access token
   * @throws HttpException if the email or password is invalid
   */
  @Decorators.SwaggerLoginResponse()
  @Post('login')
  public async login(@Body() request: LoginRequest) {
    this.logger.log(`Logging in user ${request.getEmail()}`)
    return this.authenticationService.login(request)
  }

  /**
   * Registers a new user
   * @param body The register request body
   * @param res The response object
   * @returns The created user
   * @throws HttpException if the request is invalid
   */
  @Decorators.SwaggerRegisterResponse()
  @Post('register')
  public async register(@Body() request: RegisterRequest, @Res() res: Response) {
    this.logger.log(`Registering new user ${request.getEmail()}`)
    const response = await this.authenticationService.register(request)
    res.status(HttpStatus.CREATED).send(response)
  }

  /**
   * Logs out a user
   * @param request The request object
   * @param response The response object
   * @returns The logout response
   * @throws HttpException if the logout fails
   */
  @Decorators.SwaggerLogoutResponse()
  @Get('logout')
  public async logout(@Req() request: Request, @Res() response: Response) {
    await this.authenticationService.logout(request)
    response.status(HttpStatus.NO_CONTENT).send()
  }
}

export default AuthenticationController
