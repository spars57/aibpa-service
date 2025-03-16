import { Logger } from '@nestjs/common'
import Environment from './env'

class BaseController {
  public readonly env: Environment
  public readonly logger: Logger
  constructor(name: string) {
    this.env = new Environment()
    this.logger = new Logger(name)
  }
}

export default BaseController
