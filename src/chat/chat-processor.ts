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

      if (!message.chat_id || !message.content) {
        throw new Error('Mensagem inválida: chat_id e content são obrigatórios')
      }

      // Envia a mensagem para o serviço Mistral
      const response = await axios.post(this.env.get('AI_URL'), {
        question: message.content,
      })

      // Salva a resposta do Mistral no banco de dados
      const savedMessage = await this.prisma.message.create({
        data: {
          chat_id: message.chat_id,
          user_id: message.user_id || 1,
          content: response.data, // A resposta direta do Mistral
          is_agent: true,
        },
      })

      this.logger.verbose(`Message processed: ${JSON.stringify(savedMessage)}`)
      return savedMessage
    } catch (error) {
      this.logger.error(error.message)
      throw error
    }
  }
}

export default ChatProcessor
