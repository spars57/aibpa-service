import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Chat, User } from '@prisma/client'
import BaseService from 'src/classes/base-service'
import { ChatMessages } from 'src/controller/chat/messages'
import UserRepository from 'src/repository/user'
import CreateMessageRequest from 'src/types/request/chat/create-message'
import CreateChatResponse from 'src/types/response/chat/create-chat'
import GetMessageResponse from 'src/types/response/chat/get-message'
import ChatRepository from '../repository/chat'
import MessageRepository from '../repository/message'

@Injectable()
export class ChatService extends BaseService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {
    super(ChatService.name)
  }

  async createChat(userUuid: User['uuid']) {
    const user = await this.userRepository.getByUuid(userUuid)
    if (!user) {
      this.logger.error(`User with uuid ${userUuid} not found`)
      throw new HttpException(ChatMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const response = await this.chatRepository.create({
      title: 'New Chat',
      user_id: user.id,
    })

    this.logger.verbose(response)

    return new CreateChatResponse(response, user)
  }

  async getUserChats(userUuid: User['uuid']) {
    const user = await this.userRepository.getByUuid(userUuid)
    this.logger.log(user)
    if (!user) {
      this.logger.error(`User with uuid ${userUuid} not found`)
      throw new HttpException(ChatMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }
    const response = await this.chatRepository.getByUserUuid(userUuid)
    return response.map((chat) => new CreateChatResponse(chat, user))
  }

  async getMessages(chatUuid: Chat['uuid']) {
    const chat = await this.chatRepository.getByUuid(chatUuid)
    if (!chat) {
      this.logger.error(`Chat with uuid ${chatUuid} not found`)
      throw new HttpException(ChatMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }
    return this.messageRepository.getByChatId(chat.id)
  }

  async sendMessage(request: CreateMessageRequest) {
    this.logger.log(`Sending Message to RabbitMQ: ${request.getContent()}`)

    const user = await this.userRepository.getByUuid(request.getUserUuid())
    if (!user) {
      this.logger.error(`User with uuid ${request.getUserUuid()} not found`)
      throw new HttpException(ChatMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const chat = await this.chatRepository.getByUuid(request.getChatUuid())
    if (!chat) {
      this.logger.error(`Chat with uuid ${request.getChatUuid()} not found`)
      throw new HttpException(ChatMessages.BadRequest, HttpStatus.BAD_REQUEST)
    }

    const message = await this.messageRepository.create({
      chat_id: chat.id,
      user_id: user.id,
      content: request.getContent(),
      is_agent: false,
      created_at: new Date(),
    })

    this.chatClient.emit('chat_request', message)
    return new GetMessageResponse(message, chat)
  }
}

export default ChatService
