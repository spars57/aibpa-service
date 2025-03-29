import * as jwt from 'jwt-simple'
import Environment from './env'

class JwtUtils {
  private readonly secret: string

  constructor() {
    const env = new Environment()
    this.secret = env.get('JWT_SECRET')
  }

  public async generate(payload: Record<string, any>) {
    const token = jwt.encode(payload, this.secret)
    return token
  }

  public async decode<T>(token: string): Promise<T> {
    const decoded = jwt.decode(token, this.secret)
    return decoded as T
  }
}

export default JwtUtils
