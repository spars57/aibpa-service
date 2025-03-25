import { Controller, Get } from '@nestjs/common'
import BaseController from 'src/classes/base-controller'

@Controller('health')
class HealthController extends BaseController {
  constructor() {
    super(HealthController.name)
  }

  @Get()
  getHealth() {
    return 'OK'
  }
}

export default HealthController
