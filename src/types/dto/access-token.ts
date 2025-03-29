import { AccessToken, User } from '@prisma/client'

export type InternalAccessToken = {
  user: User
  accessToken: AccessToken
}
