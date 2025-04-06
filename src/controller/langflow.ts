import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import AuthInterceptor from 'src/interceptor/auth'
import LangflowService from 'src/service/langflow'
import { LangflowQueryRequest } from 'src/types/request/langflow'

@Controller('langflow')
@UseInterceptors(AuthInterceptor)
class LangflowController {
  constructor(private readonly langflowService: LangflowService) {}

  @Post('query')
  async query(@Body() request: LangflowQueryRequest) {
    return await this.langflowService.query(request)
  }
}

export default LangflowController
