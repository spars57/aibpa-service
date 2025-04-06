import { Body, Controller, Post, UseInterceptors } from '@nestjs/common'
import AuthInterceptor from 'src/interceptor/auth'
import ArtificialInteligenceService from 'src/service/ai'
import { LangflowQueryRequest } from 'src/types/request/langflow'

@Controller('ai')
@UseInterceptors(AuthInterceptor)
class ArtificialInteligenceController {
  constructor(private readonly artificialInteligenceService: ArtificialInteligenceService) {}

  @Post('query')
  async query(@Body() request: LangflowQueryRequest) {
    return await this.artificialInteligenceService.query(request)
  }
}

export default ArtificialInteligenceController
