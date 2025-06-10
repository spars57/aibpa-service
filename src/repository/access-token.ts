import { Injectable } from '@nestjs/common'
import { AccessToken } from '@prisma/client'
import PrismaService from 'src/prisma.service'

@Injectable()
class AccessTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: Omit<AccessToken, 'id'>) {
    return this.prisma.accessToken.create({ data })
  }

  public async findByUuid(uuid: AccessToken['uuid']) {
    return this.prisma.accessToken.findUnique({ where: { uuid } })
  }

  public async findByUserUuid(user_uuid: AccessToken['user_uuid']) {
    return this.prisma.accessToken.findFirst({ where: { user_uuid } })
  }

  public async delete(uuid: AccessToken['uuid'], user_uuid: AccessToken['user_uuid']) {
    return this.prisma.accessToken.delete({ where: { uuid, user_uuid } })
  }
}

export default AccessTokenRepository
