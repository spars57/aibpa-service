import { Injectable } from '@nestjs/common'
import BaseService from 'src/classes/base-service'
import { LangflowQueryRequest } from 'src/types/request/langflow'

@Injectable()
class ArtificialInteligenceService extends BaseService {
  constructor() {
    super(ArtificialInteligenceService.name)
  }

  public async query(request: LangflowQueryRequest) {
    this.logger.log(request)
    const body = {
      model: 'DeepSeek-Chat',
      messages: [
        {
          role: 'user',
          content: request.question,
        },
      ],
      max_tokens: 1024,
      temperature: 0.1,
    }

    const response = await fetch(`http://localhost:4891/v1/chat/completions`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    }).catch((error) => {
      this.logger.error(error)
      throw error
    })
    const json = await response.json()
    return json
  }
}

export default ArtificialInteligenceService
