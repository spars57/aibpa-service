import { AccessToken, User } from '@prisma/client'

export type InternalAccessToken = {
  userUuid: User['uuid']
  uuid: AccessToken['uuid']
}
