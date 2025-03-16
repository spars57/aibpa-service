import * as crypto from 'crypto'
import Environment from 'src/classes/env'

class Encrypt {
  private readonly env: Environment
  constructor() {
    this.env = new Environment()
  }

  public async encrypt(data: string): Promise<string> {
    const saltedData = data + this.env.get('SALT')
    const hash = crypto.createHash('sha256').update(saltedData).digest('hex')
    console.log(hash)
    return hash
  }

  public async compare(data: string, hash: string): Promise<boolean> {
    return hash === data
  }
}

export default Encrypt
