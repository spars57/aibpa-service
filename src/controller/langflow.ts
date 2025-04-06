import { Body, Controller, Post } from '@nestjs/common'
import LangflowService from 'src/service/langflow'
import { LangflowQueryRequest } from 'src/types/request/langflow'

@Controller('langflow')
class LangflowController {
  constructor(private readonly langflowService: LangflowService) {}

  @Post('query')
  async query(@Body() request: LangflowQueryRequest) {
    return await this.langflowService.query(request)
  }
}

export default LangflowController
