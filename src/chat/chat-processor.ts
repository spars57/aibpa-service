import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import axios from 'axios'
import Environment from 'src/classes/env'
import { PrismaService } from '../prisma.service'

@Controller()
export class ChatProcessor {
  private readonly env = new Environment()
  private readonly logger = new Logger(ChatProcessor.name)

  constructor(private prisma: PrismaService) {}

  @EventPattern('chat_request')
  async handleChatRequest(@Payload() message: any) {
    try {
      this.logger.log(`Getting Message from RabbitMQ: ${JSON.stringify(message)}`)

      const response = await axios.post(this.env.get('AI_URL'), {
        question: message.content,
      })

      const savedMessage = await this.prisma.message.create({
        data: {
          chat_id: message.chat_id,
          user_id: message.user_id || 1,
          content: response.data,
          is_agent: true,
        },
      })

      this.logger.log(`Message processed: ${JSON.stringify(savedMessage)}`)
      return savedMessage
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}

export default ChatProcessor
