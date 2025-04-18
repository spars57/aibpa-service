import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Chat, User } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import ChatRepository from '../respository/chat'
import MessageRepository from '../respository/message'

@Injectable()
export class ChatService extends BaseService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {
    super(ChatService.name)
  }

  // Criar um novo chat para um usuário
  async createChat(userId: User['id'], title: string) {
    const chatData = {
      user_id: userId,
      title,
    }

    return this.chatRepository.create(chatData)
  }

  // Listar todos os chats de um usuário
  async getUserChats(userId: User['id']) {
    return this.chatRepository.getByUserId(userId)
  }

  // Buscar todas as mensagens de um chat específico
  async getMessages(chatId: Chat['id']) {
    return this.messageRepository.getByChatId(chatId)
  }

  // Enviar uma mensagem para um chat
  async sendMessage(chatId: Chat['id'], userId: User['id'], content: string) {
    this.logger.verbose(`📤 Sending Message to RabbitMQ: ${content}`)

    if (isNaN(chatId) || isNaN(userId)) {
      throw new Error('chatId e userId must be valid')
    }

    // Verificar se o chat existe
    const chat = await this.chatRepository.getById(chatId)
    if (!chat) {
      throw new Error(`Chat with id ${chatId} not found.`)
    }

    // Verificar se o usuário existe
    const user = await this.chatRepository.getByUserId(userId)
    if (!user) {
      throw new Error(`User id ${userId} not found.`)
    }

    // Criar a mensagem na base de dados
    const newMessage = await this.messageRepository.create({
      chat_id: chatId,
      user_id: userId,
      content,
      is_agent: false,
    })

    // Enviar a mensagem para RabbitMQ
    this.chatClient.emit('chat_request', newMessage)

    return { success: true, chatId, userId, content }
  }
}

export default ChatService
