import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import PrismaService from 'src/prisma.service'
import { User as InternalUser } from 'src/types/user'
import { v4 } from 'uuid'

@Injectable()
class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getByName(name: InternalUser['name']): Promise<InternalUser | null> {
    const user = await this.prisma.user
      .findFirst({
        where: {
          name,
        },
      })
      .then(this.convertDatabaseUserToUser)

    return user
  }

  public async create(
    name: InternalUser['name'],
    password: InternalUser['password'],
    email: InternalUser['email'],
  ): Promise<InternalUser> {
    const uuid = v4()

    return await this.prisma.user
      .create({
        data: { name, password, email, uuid, enabled: true },
      })
      .then(this.convertDatabaseUserToUser)
  }

  public async getByUuid(uuid: InternalUser['uuid']): Promise<InternalUser | null> {
    return await this.prisma.user
      .findUnique({
        where: {
          uuid,
        },
      })
      .then(this.convertDatabaseUserToUser)
  }

  public async getByEmail(email: InternalUser['email']): Promise<InternalUser | null> {
    return this.prisma.user
      .findFirst({
        where: {
          email,
        },
      })
      .then(this.convertDatabaseUserToUser)
  }

  private convertDatabaseUserToUser(user: User): InternalUser {
    return {
      uuid: user?.uuid,
      name: user?.name,
      email: user?.email,
      password: user?.password,
      enabled: user?.enabled,
      created_at: user?.created_at,
    }
  }
}

export default UserRepository
