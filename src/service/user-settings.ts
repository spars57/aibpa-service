import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, UserSettingsKey } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import { UserSettingsMessages } from 'src/controller/user-settings/messages'
import UserRepository from 'src/repository/user'
import UserSettingsRepository from 'src/repository/user-settings'
import CreateUserSettingsRequest from 'src/types/request/user-settings/create'
import CreateUserSettingsResponse from 'src/types/response/user-settings/create'

const USER_SETTINGS_KEYS: UserSettingsKey[] = ['GOOGLE_CALENDAR_API_KEY', 'OPENAI_API_KEY']

@Injectable()
class UserSettingsService extends BaseService {
  constructor(
    private readonly userSettingsRepository: UserSettingsRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(UserSettingsService.name)
  }

  /**
   * Creates a new user setting
   * @param request The request object
   * @returns The created user setting
   * @throws HttpException if the request is invalid
   */
  async create(request: CreateUserSettingsRequest) {
    this.logger.log(`Creating user settings for user ${request.getUserUuid()}`)

    if (!request.getUserUuid() || !request.getKey() || !request.getValue()) {
      this.logger.error(UserSettingsMessages.BadRequest)
      throw new HttpException(UserSettingsMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const userUuid = request.getUserUuid()
    const key = request.getKey()

    if (!USER_SETTINGS_KEYS.includes(key as UserSettingsKey)) {
      this.logger.error(UserSettingsMessages.BadRequest)
      throw new HttpException(UserSettingsMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const user = await this.userRepository.getByUuid(userUuid)
    if (!user) {
      this.logger.error(UserSettingsMessages.BadRequest)
      throw new HttpException(UserSettingsMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const currentSetting = await this.userSettingsRepository.getByUserUuid(userUuid, key as UserSettingsKey)

    if (currentSetting.length > 0) {
      this.logger.log(`User settings already exists for user ${userUuid} and key ${key}`)
      this.logger.log(`Updating user settings for user ${userUuid} and key ${key}`)
      const settingId = currentSetting[0].id
      const updatedSetting = await this.userSettingsRepository.update(settingId, request)
      return new CreateUserSettingsResponse(updatedSetting, user.uuid)
    } else {
      this.logger.log(`User settings does not exist for user ${userUuid} and key ${key}`)
      this.logger.log(`Creating user settings for user ${userUuid} and key ${key}`)
      const userSettings = await this.userSettingsRepository.create(request)
      return new CreateUserSettingsResponse(userSettings, user.uuid)
    }
  }

  /**
   * Gets user settings by user uuid
   * @param uuid The user uuid
   * @returns The user settings
   * @throws HttpException if the user uuid is invalid
   */
  async getByUserUuid(uuid: User['uuid']) {
    if (!uuid) {
      this.logger.error(UserSettingsMessages.BadRequest)
      throw new HttpException(UserSettingsMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) {
      this.logger.error(UserSettingsMessages.UserNotFound)
      throw new HttpException(UserSettingsMessages.UserNotFound, HttpStatus.NOT_FOUND)
    }
    const settings = await this.userSettingsRepository.getByUserUuid(uuid)
    this.logger.log(`${settings.length} user settings for user ${uuid} retrieved successfully`)
    return settings.map((setting) => new CreateUserSettingsResponse(setting, user.uuid))
  }

  /**
   * Deletes a user setting by user uuid and key
   * @param uuid The user uuid
   * @param key The user setting key
   * @returns The deleted user setting
   * @throws HttpException if the user uuid is invalid
   */
  async delete(uuid: User['uuid'], key: UserSettingsKey) {
    if (!uuid) {
      this.logger.error(UserSettingsMessages.BadRequest)
      throw new HttpException(UserSettingsMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) {
      this.logger.error(UserSettingsMessages.UserNotFound)
      throw new HttpException(UserSettingsMessages.UserNotFound, HttpStatus.BAD_REQUEST)
    }
    const settings = await this.userSettingsRepository.getByUserUuid(uuid, key)
    if (settings.length === 0) {
      this.logger.error(UserSettingsMessages.UserSettingNotFound)
      throw new HttpException(UserSettingsMessages.UserSettingNotFound, HttpStatus.BAD_REQUEST)
    }
    this.logger.log(`Deleting user settings for user ${uuid} and key ${key}`)
    return this.userSettingsRepository.delete(uuid, key)
  }
}

export default UserSettingsService
