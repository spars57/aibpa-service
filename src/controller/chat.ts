import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Chat, User } from '@prisma/client'
import { ChatService } from '../service/chat'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //  Criar um novo chat
  @Post()
  async createChat(@Body('userId') userId: User['id'], @Body('title') title: string) {
    return this.chatService.createChat(userId, title)
  }

  //  Buscar todos os chats de um usuário
  @Get('user/:userId')
  async getUserChats(@Param('userId') userId: User['id']) {
    return this.chatService.getUserChats(userId)
  }

  //  Buscar todas as mensagens de um chat
  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: Chat['id']) {
    return this.chatService.getMessages(chatId)
  }

  //  Enviar uma mensagem para um chat
  @Post(':chatId/messages')
  async sendMessage(
    @Param('chatId') chatId: Chat['id'],
    @Body('userId') userId: User['id'],
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(chatId, userId, content)
  }
}

export default ChatController
