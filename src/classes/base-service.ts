import { Logger } from '@nestjs/common'
import Encrypt from 'src/utils/encrypt'
import Environment from './env'
import JwtUtils from './jwt'

class BaseService {
  public readonly env: Environment
  public readonly encrypt: Encrypt
  public readonly jwt: JwtUtils
  public logger: Logger
  constructor(name: string) {
    this.env = new Environment()
    this.encrypt = new Encrypt()
    this.jwt = new JwtUtils()
    this.logger = new Logger(name)
  }
}

export default BaseService
