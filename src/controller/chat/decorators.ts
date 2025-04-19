import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import CreateMessageRequest from 'src/types/request/chat/create-message'
import CreateChatResponse from 'src/types/response/chat/create-chat'
import GetMessageResponse from 'src/types/response/chat/get-message'
import { AuthenticationErrorMessages } from '../authentication/messages'
import { ChatMessages } from './messages'

export const SwaggerGetChatResponse = () =>
  applyDecorators(
    ApiParam({
      name: 'userUuid',
      type: String,
      description: 'The UUID of the user',
      required: true,
    }),
    ApiBadRequestResponse({
      description: ChatMessages.BadRequest,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
    ApiCreatedResponse({
      description: ChatMessages.Success,
      type: CreateChatResponse,
      isArray: true,
    }),
  )

export const SwaggerCreateChatResponse = () =>
  applyDecorators(
    ApiParam({
      name: 'userUuid',
      type: String,
      description: 'The UUID of the user',
      required: true,
    }),
    ApiBadRequestResponse({
      description: ChatMessages.BadRequest,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
    ApiCreatedResponse({
      type: CreateChatResponse,
    }),
  )

export const SwaggerGetMessagesResponse = () =>
  applyDecorators(
    ApiParam({
      name: 'chatUuid',
      type: String,
      description: 'The UUID of the chat',
      required: true,
    }),
    ApiBadRequestResponse({
      description: ChatMessages.BadRequest,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
    ApiOkResponse({
      description: ChatMessages.Success,
      type: GetMessageResponse,
      isArray: true,
    }),
  )

export const SwaggerSendMessageResponse = () =>
  applyDecorators(
    ApiParam({
      name: 'chatUuid',
      type: String,
      description: 'The UUID of the chat',
      required: true,
    }),
    ApiBadRequestResponse({
      description: ChatMessages.BadRequest,
    }),
    ApiBody({
      description: 'The message to send',
      type: CreateMessageRequest,
    }),
    ApiUnauthorizedResponse({
      description: AuthenticationErrorMessages.Unauthorized,
    }),
    ApiCreatedResponse({
      type: GetMessageResponse,
    }),
  )
