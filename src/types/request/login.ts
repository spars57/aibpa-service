import { User } from '@prisma/client'

type LoginRequest = {
  email: User['email']
  password: User['password']
}

export default LoginRequest
