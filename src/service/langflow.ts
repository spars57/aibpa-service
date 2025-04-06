import { Injectable } from '@nestjs/common'
import BaseService from 'src/classes/base-service'
import { LangflowQueryRequest } from 'src/types/request/langflow'

@Injectable()
class LangflowService extends BaseService {
  private langflowUrl: string
  constructor() {
    super(LangflowService.name)
    this.langflowUrl = this.env.get('LANGFLOW_URL')
  }

  public async query(request: LangflowQueryRequest) {
    this.logger.log(request)
    const response = await fetch(`http://localhost:8081/ask`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(request),
    }).catch((error) => {
      this.logger.error(error)
      throw error
    })
    return response?.text()
  }
}

export default LangflowService
