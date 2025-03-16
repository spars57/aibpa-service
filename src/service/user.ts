import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import UserRepository from 'src/respository/user'

@Injectable()
class UserService extends BaseService {
  constructor(private readonly userRepository: UserRepository) {
    super(UserService.name)
  }

  public async getById(uuid: User['uuid']) {
    const user = await this.userRepository.getByUuid(uuid)
    if (!user) {
      this.logger.error(`User with uuid ${uuid} not found`)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }
}

export default UserService
