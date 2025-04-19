import { Injectable } from '@nestjs/common'
import { User, UserSettings, UserSettingsKey } from '@prisma/client'
import PrismaService from 'src/prisma.service'
import CreateUserSettingsRequest from 'src/types/request/user-settings/create'

@Injectable()
class UserSettingsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserSettingsRequest) {
    const user = await this.prisma.user.findFirst({ where: { uuid: data.getUserUuid() } })
    if (!user) {
      throw new Error('User not found')
    }
    return this.prisma.userSettings.create({
      data: {
        key: data.getKey() as UserSettingsKey,
        value: data.getValue(),
        user_id: user.id,
      },
    })
  }

  async getByUserUuid(userUuid: User['uuid'], key?: UserSettingsKey) {
    const user = await this.prisma.user.findFirst({ where: { uuid: userUuid } })
    if (!user) {
      throw new Error('User not found')
    }
    return this.prisma.userSettings.findMany({ where: { user_id: user.id, key } })
  }

  async update(id: UserSettings['id'], data: CreateUserSettingsRequest) {
    return this.prisma.userSettings.update({
      where: { id },
      data: { key: data.getKey() as UserSettingsKey, value: data.getValue() },
    })
  }

  async delete(userUuid: User['uuid'], key: UserSettingsKey) {
    const user = await this.prisma.user.findUnique({ where: { uuid: userUuid } })
    if (!user) {
      throw new Error('User not found')
    }
    const userSettings = await this.prisma.userSettings.findMany({ where: { user_id: user.id, key } })
    if (!userSettings) {
      throw new Error('User settings not found')
    }
    return this.prisma.userSettings.deleteMany({
      where: { id: { in: userSettings.map((userSetting) => userSetting.id) }, key },
    })
  }
}

export default UserSettingsRepository
