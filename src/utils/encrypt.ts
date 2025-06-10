import { Logger } from '@nestjs/common'
import * as crypto from 'crypto'
import Environment from 'src/classes/env'

/**
 * Encrypts and compares strings
 */
class Encrypt {
  private readonly env: Environment
  private readonly logger: Logger
  constructor() {
    this.env = new Environment()
    this.logger = new Logger(Encrypt.name)
  }

  /**
   * Encrypts a string using the salt
   * @param data The string to encrypt
   * @returns The encrypted string
   */
  public async encrypt(data: string): Promise<string> {
    const saltedData = data + this.env.get('SALT')
    const hash = crypto.createHash('sha256').update(saltedData).digest('hex')
    return hash
  }

  /**
   * Compares a string with a hash
   * @param data The string to compare
   * @param hash The hash to compare
   * @returns True if the string is equal to the hash, false otherwise
   */
  public async compare(data: string, hash: string): Promise<boolean> {
    return hash === data
  }
}

export default Encrypt
