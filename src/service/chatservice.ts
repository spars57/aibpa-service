import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import ChatRepository from '../respository/chat'
import MessageRepository from '../respository/message'
import ChatProcessor from '../chat/chatProcessor';


@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
    private readonly chatRepository: ChatRepository,  // Usando o repositório de chat
    private readonly messageRepository: MessageRepository,  // Usando o repositório de mensagens
  ) {}

  // Criar um novo chat para um usuário
  async createChat(userId: number, title: string) {
    const chatData = {
      user_id: userId,
      title,
    };

    return this.chatRepository.create(chatData);  // Usando o repositório para criar chat
  }

  // Listar todos os chats de um usuário
  async getUserChats(userId: number) {
    return this.chatRepository.getByUserId(userId);  // Usando o repositório para obter chats do usuário
  }

  // Buscar todas as mensagens de um chat específico
  async getMessages(chatId: number) {
    return this.messageRepository.getByChatId(chatId);  // Usando o repositório para buscar mensagens do chat
  }

  // Enviar uma mensagem para um chat
  async sendMessage(chatId: string, userId: string, content: string) {
    console.log(`📤 Enviando mensagem para RabbitMQ: ${content}`);

    const chatIdInt = parseInt(chatId, 10);
    const userIdInt = parseInt(userId, 10);

    if (isNaN(chatIdInt) || isNaN(userIdInt)) {
      throw new Error('chatId e userId devem ser números válidos');
    }

    // Verificar se o chat existe
    const chat = await this.chatRepository.getById(chatIdInt);
    if (!chat) {
      throw new Error(`Chat com id ${chatIdInt} não encontrado.`);
    }

    // Verificar se o usuário existe
    const user = await this.chatRepository.getByUserId(userIdInt);
    if (!user) {
      throw new Error(`Usuário com id ${userIdInt} não encontrado.`);
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
