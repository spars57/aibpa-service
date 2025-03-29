import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import PrismaService from 'src/prisma.service'
import { v4 } from 'uuid'

@Injectable()
class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getByName(username: User['username']): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { username } })
  }

  public async create(user: User): Promise<User> {
    return await this.prisma.user.create({
      data: { ...user, uuid: v4() },
    })
  }

  public async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  public async getByUuid(uuid: User['uuid']): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    })
  }

  public async getByEmail(email: User['email']): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    })
  }
}

export default UserRepository
