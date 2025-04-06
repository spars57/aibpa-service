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
      this.logger.log(`📩 Recebendo mensagem do RabbitMQ: ${JSON.stringify(message)}`);

      if (!message.chat_id || !message.content) {
        throw new Error('Mensagem inválida: chat_id e content são obrigatórios');
      }

      // Processa a mensagem - salvar no banco de dados
      const savedMessage = await this.prisma.message.create({
        data: {
          chat_id: message.chat_id,
          user_id: message.user_id || 1, // Usa o user_id da mensagem ou 1 como fallback
          content: message.content,
          is_agent: true,
        },
      });

      this.logger.log(`📥 Mensagem processada e salva na BD: ${JSON.stringify(savedMessage)}`);
      return savedMessage;
    } catch (error) {
      this.logger.error(`❌ Erro ao processar mensagem: ${error.message}`);
      throw error;
    }
  }
}

export default ChatProcessor;
