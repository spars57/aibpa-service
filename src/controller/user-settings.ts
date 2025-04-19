import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { User, UserSettingsKey } from '@prisma/client'
import BaseController from 'src/classes/base-controller'
import AuthInterceptor from 'src/interceptor/auth'
import UserSettingsService from 'src/service/user-settings'
import CreateUserSettingsRequest from 'src/types/request/user-settings/create'

@Controller('user-settings')
@UseInterceptors(AuthInterceptor)
class UserSettingsController extends BaseController {
  constructor(private readonly userSettingsService: UserSettingsService) {
    super(UserSettingsController.name)
  }

  @Get('/:uuid')
  async getByUserId(@Param('uuid') uuid: User['uuid']) {
    this.logger.log(`Getting user settings for user ${uuid}`)
    return this.userSettingsService.getByUserUuid(uuid)
  }

  @Post()
  async create(@Body() body: CreateUserSettingsRequest) {
    this.logger.log(`Creating user settings for user ${body.getUserUuid()}`)
    return this.userSettingsService.create(body)
  }

  @Delete(':uuid/:key')
  async delete(@Param('uuid') uuid: User['uuid'], @Param('key') key: UserSettingsKey) {
    this.logger.log(`Deleting user settings for user ${uuid} with key ${key}`)
    return this.userSettingsService.delete(uuid, key)
  }
}

export default UserSettingsController
