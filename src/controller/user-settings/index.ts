import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User, UserSettingsKey } from '@prisma/client'
import { Response } from 'express'
import BaseController from 'src/classes/base-controller'
import AuthInterceptor from 'src/interceptor/authentication'
import UserSettingsService from 'src/service/user-settings'
import CreateUserSettingsRequest from 'src/types/request/user-settings/create'
import * as Decorators from './decorators'

@Controller('user-settings')
@ApiTags('User Settings')
@UseInterceptors(AuthInterceptor)
class UserSettingsController extends BaseController {
  constructor(private readonly userSettingsService: UserSettingsService) {
    super(UserSettingsController.name)
  }

  /**
   * Gets user settings by user uuid
   * @param uuid The user uuid
   * @returns The user settings
   * @throws HttpException if the user uuid is invalid
   */
  @Decorators.SwaggerGetUserSettingsResponse()
  @Get('/:uuid')
  async getByUserId(@Param('uuid') uuid: User['uuid']) {
    this.logger.log(`Getting user settings for user ${uuid}`)
    return this.userSettingsService.getByUserUuid(uuid)
  }

  /**
   * Creates a new user setting
   * @param request The user setting body
   * @returns The created user setting
   * @throws HttpException if the user setting is invalid
   */
  @Decorators.SwaggerCreateUserSettingsResponse()
  @Post()
  async create(@Body() request: CreateUserSettingsRequest) {
    this.logger.log(`Creating user settings for user ${request.getUserUuid()}`)
    return this.userSettingsService.create(request)
  }

  /**
   * Deletes a user setting by user uuid and key
   * @param uuid The user uuid
   * @param key The user setting key
   * @returns The deleted user setting
   * @throws HttpException if the user setting is invalid
   */
  @Decorators.SwaggerDeleteUserSettingsResponse()
  @Delete(':uuid/:key')
  async delete(@Param('uuid') uuid: User['uuid'], @Param('key') key: UserSettingsKey, @Res() res: Response) {
    this.logger.log(`Deleting user settings for user ${uuid} with key ${key}`)
    await this.userSettingsService.delete(uuid, key)
    res.status(HttpStatus.NO_CONTENT).send()
  }
}

export default UserSettingsController
