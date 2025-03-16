import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common'
import { User } from '@prisma/client'
import { Response } from 'express'
import BaseController from 'src/classes/base-controller'
import AuthService from 'src/service/auth'

@Controller('auth')
class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super(AuthController.name)
  }

  @Post('login')
  public async login(@Body() body: { name: User['name']; password: User['password'] }) {
    const { name, password } = body
    return this.authService.login(name, password)
  }

  @Post('logout/:uuid')
  public async logout(@Res() res: Response, @Param('uuid') uuid: string) {
    await this.authService.logout(uuid)
    return res.status(HttpStatus.ACCEPTED).send()
  }

  @Post('register')
  public async register(
    @Body()
    body: {
      name: User['name']
      password: User['password']
      email: User['email']
    },
  ) {
    const { name, password, email } = body
    return this.authService.register(name, password, email)
  }
}

export default AuthController
