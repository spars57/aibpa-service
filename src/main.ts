import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')
  const port = process.env.PORT ?? 3000
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'chat_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.startAllMicroservices()
  await app.listen(port)

  logger.log(`Server is running on port ${port}`)
  logger.log(`Microservice is listening on queue: chat_queue`)
}
bootstrap()
