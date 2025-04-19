import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import ChatProcessor from './chat/chat-processor'
import AuthenticationController from './controller/authentication'
import ChatController from './controller/chat'
import UserSettingsController from './controller/user-settings'
import AuthInterceptor from './interceptor/authentication'
import PrismaService from './prisma.service'
import AccessTokenRepository from './repository/access-token'
import ChatRepository from './repository/chat'
import MessageRepository from './repository/message'
import UserRepository from './repository/user'
import UserSettingsRepository from './repository/user-settings'
import AuthenticationService from './service/authentication'
import ChatService from './service/chat'
import UserSettingsService from './service/user-settings'

const SERVICES = [AuthenticationService, PrismaService, ChatService, UserSettingsService]
const REPOSITORIES = [UserRepository, AccessTokenRepository, MessageRepository, ChatRepository, UserSettingsRepository]
const CONTROLLERS = [AuthenticationController, ChatController, UserSettingsController]
const INTERCEPTORS = [AuthInterceptor]

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'chat_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [...CONTROLLERS, ChatProcessor],
  providers: [...SERVICES, ...REPOSITORIES, ...INTERCEPTORS],
})
export class AppModule {}
