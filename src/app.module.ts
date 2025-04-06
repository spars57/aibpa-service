import { Module } from '@nestjs/common'
import AuthController from './controller/auth'
import HealthController from './controller/health'
import LangflowController from './controller/langflow'
import AuthInterceptor from './interceptor/auth'
import PrismaService from './prisma.service'
import AccessTokenRepository from './respository/access-token'
import UserRepository from './respository/user'
import AuthService from './service/auth'
import LangflowService from './service/langflow'

const SERVICES = [AuthService, PrismaService, LangflowService]
const REPOSITORIES = [UserRepository, AccessTokenRepository]
const CONTROLLERS = [AuthController, HealthController, LangflowController]
const INTERCEPTORS = [AuthInterceptor]
@Module({
  imports: [],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES, ...REPOSITORIES, ...INTERCEPTORS],
})
export class AppModule {}
