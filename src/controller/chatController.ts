import { Controller, Get, Post, Body, Param, ParseIntPipe  } from '@nestjs/common';
import { ChatService } from '../service/chatservice';
import ChatProcessor from '../chat/chatProcessor';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  //  Criar um novo chat
  @Post()
  async createChat(@Body('userId') userId: number, @Body('title') title: string) {
    return this.chatService.createChat(userId, title);
  }

  //  Buscar todos os chats de um usuário
  @Get('user/:userId')
  async getUserChats(@Param('userId') userId: string) {
    const userIdInt = parseInt(userId, 10);  

    return this.chatService.getUserChats(userIdInt);
  }

  //  Buscar todas as mensagens de um chat
  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    const chatIdInt = parseInt(chatId, 10);  
    if (isNaN(chatIdInt)) {
      throw new Error('chatId deve ser um número válido');
    }
    return this.chatService.getMessages(chatIdInt);  
  }
  

  //  Enviar uma mensagem para um chat
  @Post(':chatId/messages')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body('userId') userId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(chatId, userId, content);
  }
}

export default ChatController;
