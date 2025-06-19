import { Logger } from '@nestjs/common'

export const EnvironmentKeysEnum = {
  SALT: 'SALT',
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  JWT_VALIDITY_PERIOD: 'JWT_VALIDITY_PERIOD',
  AI_URL: 'AI_URL',
  RABBITMQ_URL: 'RABBITMQ_URL',
  LANGFLOW_URL: 'LANGFLOW_URL',
} as const

type EnvKey = (typeof EnvironmentKeysEnum)[keyof typeof EnvironmentKeysEnum]

class Environment {
  private logger: Logger

  private SALT: string
  private NODE_ENV: string
  private PORT: string
  private DATABASE_URL: string
  private JWT_SECRET: string
  private JWT_VALIDITY_PERIOD: string
  private AI_URL: string
  private RABBITMQ_URL: string
  private LANGFLOW_URL: string

  private checkIfEnvIsSet(key: EnvKey) {
    //this.logger.log(`Checking if environment variable ${key} is set`);
    if (!process.env[key]) {
      this.logger.error(`Environment variable ${key} is not set`)
      throw new Error(`Environment variable ${key} is not set`)
    }
  }

  constructor() {
    this.logger = new Logger(this.constructor.name)

    Object.values(EnvironmentKeysEnum).forEach((key) => {
      this.checkIfEnvIsSet(key)
      this[key] = process.env[key]!
    })
  }

  public get(key: EnvKey) {
    return this[key]
  }
}

export default Environment
