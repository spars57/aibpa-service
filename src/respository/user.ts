import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import PrismaService from 'src/prisma.service'
import { User as InternalUser } from 'src/types/user'
import { v4 } from 'uuid'

@Injectable()
class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getByName(username: InternalUser['username']): Promise<InternalUser | null> {
    const user = await this.prisma.user.findFirst({ where: { username } }).then(this.convertDatabaseUserToUser)

    return user
  }

  public async create(
    username: InternalUser['username'],
    password: InternalUser['password'],
    email: InternalUser['email'],
  ): Promise<InternalUser> {
    const uuid = v4()

    return await this.prisma.user
      .create({
        data: { username, password, email, uuid },
      })
      .then(this.convertDatabaseUserToUser)
  }

  public async getAll(): Promise<InternalUser[]> {
    return await this.prisma.user.findMany().then((users) => users.map(this.convertDatabaseUserToUser))
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
      username: user?.username,
      email: user?.email,
      password: user?.password,
      created_at: user?.created_at,
      deleted: user?.deleted,
    }
  }
}

export default UserRepository
