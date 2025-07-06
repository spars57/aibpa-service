import { Body, Controller, Get, HttpStatus, Param, Post, Res, UseInterceptors } from '@nestjs/common'
import { Chat, User } from '@prisma/client'
import { Response } from 'express'
import BaseController from 'src/classes/base-controller'
import AuthInterceptor from 'src/interceptor/authentication'
import CreateMessageRequest from 'src/types/request/chat/create-message'
import { ChatService } from '../../service/chat'
import * as Decorators from './decorators'

@Controller('chat')
@UseInterceptors(AuthInterceptor)
export class ChatController extends BaseController {
  constructor(private readonly chatService: ChatService) {
    super(ChatController.name)
  }

  @Decorators.SwaggerCreateChatResponse()
  @Post('/:userUuid')
  async createChat(@Param('userUuid') userUuid: User['uuid'], @Res() res: Response) {
    this.logger.verbose(`Creating new chat for user ${userUuid}`)
    const response = await this.chatService.createChat(userUuid)
    return res.status(HttpStatus.CREATED).json(response)
  }

  @Decorators.SwaggerGetChatResponse()
  @Get('/:userUuid')
  async getUserChats(@Param('userUuid') userUuid: User['uuid'], @Res() res: Response) {
    this.logger.verbose(`Getting chats for user ${userUuid}`)
    const response = await this.chatService.getUserChats(userUuid)
    return res.status(HttpStatus.OK).json(response)
  }

  @Decorators.SwaggerGetMessagesResponse()
  @Get('/:chatUuid/messages')
  async getMessages(@Param('chatUuid') chatUuid: Chat['uuid'], @Res() res: Response) {
    const response = await this.chatService.getMessages(chatUuid)
    return res.status(HttpStatus.OK).json(response)
  }

  @Decorators.SwaggerSendMessageResponse()
  @Post('/message/create')
  async sendMessage(@Body() createMessageRequest: CreateMessageRequest, @Res() res: Response) {
    this.logger.verbose(`Sending message to chat ${createMessageRequest.getChatUuid()}`)
    const response = await this.chatService.sendMessage(createMessageRequest)
    return res.status(HttpStatus.CREATED).json(response)
  }
}

export default ChatController
