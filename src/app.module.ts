import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuthController from './controller/auth';
import HealthController from './controller/health';
import AuthInterceptor from './interceptor/auth';
import PrismaService from './prisma.service';
import AccessTokenRepository from './respository/access-token';
import UserRepository from './respository/user';
import AuthService from './service/auth';
import ChatService from './service/chatservice';
import ChatController from './controller/chatController';
import MessageRepository from './respository/message';
import ChatRepository from './respository/chat';
import ChatProcessor from './chat/chatProcessor';

const SERVICES = [AuthService, PrismaService, ChatService];
const REPOSITORIES = [UserRepository, AccessTokenRepository, MessageRepository, ChatRepository];
const CONTROLLERS = [AuthController, HealthController, ChatController];
const INTERCEPTORS = [AuthInterceptor];

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
