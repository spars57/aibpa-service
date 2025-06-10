import { ApiProperty } from '@nestjs/swagger'

class LoginRequest {
  @ApiProperty()
  private email: string

  @ApiProperty()
  private password: string

  public constructor(email?: string, password?: string) {
    this.email = email || ''
    this.password = password || ''
  }

  public getEmail(): string {
    return this.email
  }

  public getPassword(): string {
    return this.password
  }
}

export default LoginRequest
