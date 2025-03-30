import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { Response } from 'express'
import BaseController from 'src/classes/base-controller'
import AuthService from 'src/service/auth'
import LoginRequest from 'src/types/request/login'
import RegisterRequest from 'src/types/request/register'

@Controller('auth')
class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super(AuthController.name)
  }

  @Post('login')
  public async login(@Body() body: LoginRequest) {
    return this.authService.login(body)
  }

  @Post('register')
  public async register(@Body() body: RegisterRequest, @Res() res: Response) {
    const user = await this.authService.register(body)
    res.status(HttpStatus.CREATED).send(user)
  }

  @Get('logout')
  public async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req)
    res.status(HttpStatus.OK).send({ message: 'Logged out successfully' })
  }

  // @Post('identity')
  // public async identity(@Req() req: Request) {
  //   return req.user
  // }
}

export default AuthController
