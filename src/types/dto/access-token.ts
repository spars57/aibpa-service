import { AccessToken, User } from '@prisma/client'

class InternalAccessToken {
  private user: User
  private accessToken: AccessToken

  public constructor(user: User, accessToken: AccessToken) {
    this.user = user
    this.accessToken = accessToken
  }

  public getUser(): User {
    return this.user
  }

  public getAccessToken(): AccessToken {
    return this.accessToken
  }

  public setUser(user: User): void {
    this.user = user
  }

  public setAccessToken(accessToken: AccessToken): void {
    this.accessToken = accessToken
  }

  public checkIfIsValid(): boolean {
    if (!this.user || !this.accessToken) {
      return false
    }

    return true
  }
}

export default InternalAccessToken
