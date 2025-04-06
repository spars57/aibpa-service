import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import ChatRepository from '../respository/chat'
import MessageRepository from '../respository/message'
import ChatProcessor from '../chat/chatProcessor';


@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
    private readonly chatRepository: ChatRepository,  
    private readonly messageRepository: MessageRepository, 
  ) {}

  // Criar um novo chat para um usuário
  async createChat(userId: number, title: string) {
    const chatData = {
      user_id: userId,
      title,
    };

    return this.chatRepository.create(chatData);  
  }

  // Listar todos os chats de um usuário
  async getUserChats(userId: number) {
    return this.chatRepository.getByUserId(userId); 
  }

  // Buscar todas as mensagens de um chat específico
  async getMessages(chatId: number) {
    return this.messageRepository.getByChatId(chatId);  
  }

  // Enviar uma mensagem para um chat
  async sendMessage(chatId: string, userId: string, content: string) {
    console.log(`📤 Sending Message to RabbitMQ: ${content}`);

    const chatIdInt = parseInt(chatId, 10);
    const userIdInt = parseInt(userId, 10);

    if (isNaN(chatIdInt) || isNaN(userIdInt)) {
      throw new Error('chatId e userId must be valid');
    }

    // Verificar se o chat existe
    const chat = await this.chatRepository.getById(chatIdInt);
    if (!chat) {
      throw new Error(`Chat with id ${chatIdInt} not found.`);
    }

    // Verificar se o usuário existe
    const user = await this.chatRepository.getByUserId(userIdInt);
    if (!user) {
      throw new Error(`User id ${userIdInt} not found.`);
    }

    // Criar a mensagem na base de dados
    const newMessage = await this.messageRepository.create({
      chat_id: chatIdInt,
      user_id: userIdInt,
      content,
      is_agent: false,
    });

    // Enviar a mensagem para RabbitMQ
    this.chatClient.emit('chat_request', newMessage);

    return { success: true, chatId: chatIdInt, userId: userIdInt, content };
  }
}

export default ChatService;
