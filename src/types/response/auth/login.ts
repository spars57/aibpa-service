import { ApiProperty } from '@nestjs/swagger'

class LoginResponse {
  @ApiProperty()
  private accessToken: string

  public constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  public getAccessToken(): string {
    return this.accessToken
  }

  public setAccessToken(accessToken: string): void {
    this.accessToken = accessToken
  }
}

export default LoginResponse
