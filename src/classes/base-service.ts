import { Logger } from '@nestjs/common'
import Encrypt from 'src/utils/encrypt'
import Environment from './env'

class BaseService {
  public readonly env: Environment
  public readonly encrypt: Encrypt
  public logger: Logger
  constructor(name: string) {
    this.env = new Environment()
    this.encrypt = new Encrypt()
    this.logger = new Logger(name)
  }
}

export default BaseService
