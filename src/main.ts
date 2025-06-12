import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('Bootstrap')
  const port = process.env.PORT ?? 3000

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('AIBPA Service API')
    .setDescription(
      'The backend API of the Intelligent Personal Assistant, built to manage multi-agent communication, process user requests, and orchestrate task automation. This API serves as the core of the system, enabling agents to collaborate and integrate with third-party services.',
    )
    .setVersion('1.0.0')
    .addTag('aibpa')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  // Para gerar o arquivo OpenAPI
  require('fs').writeFileSync('./swagger-spec.json', JSON.stringify(documentFactory(), null, 2))

  app.enableCors({
    origin: '*',
    headers: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'chat_queue',
      queueOptions: {
        durable: false,
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(port)

  logger.log(`Server is running on port ${port}`)
  logger.log(`Microservice is listening on queue: chat_queue`)
}
bootstrap()
