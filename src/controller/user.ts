import { Controller, Get, Param, Req, UseInterceptors } from '@nestjs/common'
import BaseController from 'src/classes/base-controller'
import AuthInterceptor from 'src/interceptor/auth'
import UserService from 'src/service/user'

@Controller('user')
@UseInterceptors(AuthInterceptor)
class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super(UserController.name)
  }

  @Get(':uuid')
  public async getUser(@Req() req: Request, @Param('uuid') uuid: string) {
    return this.userService.getById(uuid)
  }
}

export default UserController
