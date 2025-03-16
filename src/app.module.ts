import { Module } from '@nestjs/common'
import AuthController from './controller/auth'
import UserController from './controller/user'
import AuthInterceptor from './interceptor/auth'
import PrismaService from './prisma.service'
import AccessTokenRepository from './respository/access-token'
import UserRepository from './respository/user'
import AuthService from './service/auth'
import UserService from './service/user'

const SERVICES = [AuthService, PrismaService, UserService]
const REPOSITORIES = [UserRepository, AccessTokenRepository]
const CONTROLLERS = [AuthController, UserController]
const INTERCEPTORS = [AuthInterceptor]
@Module({
  imports: [],
  controllers: [...CONTROLLERS],
  providers: [...SERVICES, ...REPOSITORIES, ...INTERCEPTORS],
})
export class AppModule {}
