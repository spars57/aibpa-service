import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../prisma.service';
import ChatService from '../service/chatservice';

@Controller()
export class ChatProcessor {
  private readonly logger = new Logger(ChatProcessor.name);

  constructor(
    private prisma: PrismaService,
    private chatService: ChatService
  ) {}

  @EventPattern('chat_request')
  async handleChatRequest(@Payload() message: any) {
    try {
      this.logger.log(`📩 Getting Message from RabbitMQ: ${JSON.stringify(message)}`);

      if (!message.chat_id || !message.content) {
        throw new Error('Mensagem inválida: chat_id e content são obrigatórios');
      }

      // Processa a mensagem 
      const savedMessage = await this.prisma.message.create({
        data: {
          chat_id: message.chat_id,
          user_id: message.user_id || 1, 
          content: 'Resposta: ' +  message.content,
          is_agent: true,
        },
      });

      this.logger.log(`📥 Message processed: ${JSON.stringify(savedMessage)}`);
      return savedMessage;
    } catch (error) {
      this.logger.error(`❌ Error: ${error.message}`);
      throw error;
    }
  }
}

export default ChatProcessor;
