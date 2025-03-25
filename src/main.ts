import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')
  const port = process.env.PORT ?? 3000
  app.enableCors({
    origin: ['*'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  await app.listen(port)

  logger.log(`Server is running on port ${port}`)
}
bootstrap()
