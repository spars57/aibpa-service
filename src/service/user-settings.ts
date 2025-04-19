import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User, UserSettingsKey } from '@prisma/client'
import BaseService from 'src/classes/base-service'
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

  async create(request: CreateUserSettingsRequest): Promise<CreateUserSettingsResponse> {
    this.logger.log(`Creating user settings for user ${request.getUserUuid()}`)

    if (!request.getUserUuid()) throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST)
    if (!request.getKey()) throw new HttpException('Key is required', HttpStatus.BAD_REQUEST)
    if (!request.getValue()) throw new HttpException('Value is required', HttpStatus.BAD_REQUEST)

    const userUuid = request.getUserUuid()
    const key = request.getKey()

    if (!USER_SETTINGS_KEYS.includes(key))
      throw new HttpException(
        `Key "${key}" is invalid, must be one of the following: ${USER_SETTINGS_KEYS.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      )

    const user = await this.userRepository.getByUuid(userUuid)
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    const currentSetting = await this.userSettingsRepository.getByUserUuid(userUuid, key)

    if (currentSetting) {
      this.logger.log(`User settings already exists for user ${userUuid} and key ${key}`)
      this.logger.log(`Updating user settings for user ${userUuid} and key ${key}`)
      const settingId = currentSetting[0].id
      const updatedSetting = await this.userSettingsRepository.update(settingId, request.toUserSettings(user))
      return new CreateUserSettingsResponse(updatedSetting)
    } else {
      this.logger.log(`User settings does not exist for user ${userUuid} and key ${key}`)
      this.logger.log(`Creating user settings for user ${userUuid} and key ${key}`)
      const userSettings = await this.userSettingsRepository.create(request.toUserSettings(user))
      return new CreateUserSettingsResponse(userSettings)
    }
  }

  async getByUserUuid(uuid: User['uuid']) {
    if (!uuid) {
      this.logger.error('User ID is required')
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST)
    }
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) {
      let errorMessage = `User with uuid "${uuid}" was not found on the database.`
      this.logger.error(errorMessage)
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND)
    }
    const settings = await this.userSettingsRepository.getByUserUuid(uuid)
    this.logger.log(`${settings.length} user settings for user ${uuid} retrieved successfully`)
    return settings
  }

  async delete(uuid: User['uuid'], key: UserSettingsKey) {
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    const settings = await this.userSettingsRepository.getByUserUuid(uuid, key)
    if (settings.length === 0) throw new HttpException('User setting not found', HttpStatus.NOT_FOUND)
    this.logger.log(`Deleting user settings for user ${uuid} and key ${key}`)
    return this.userSettingsRepository.delete(uuid, key)
  }
}

export default UserSettingsService
