import { ApiProperty } from '@nestjs/swagger'
import { User, UserSettings } from '@prisma/client'

class CreateUserSettingsRequest {
  @ApiProperty()
  private key: string

  @ApiProperty()
  private value: string

  @ApiProperty()
  private userUuid: string

  public getKey(): string {
    return this.key
  }

  public setKey(key: string): void {
    this.key = key
  }

  public getUserUuid(): string {
    return this.userUuid
  }

  public setUserUuid(userUuid: string): void {
    this.userUuid = userUuid
  }

  public getValue(): string {
    return this.value
  }

  public setValue(value: string): void {
    this.value = value
  }

  public constructor(userSettings?: UserSettings, user?: User) {
    if (userSettings && user) {
      this.setKey(userSettings.key)
      this.setValue(userSettings.value)
      this.setUserUuid(user.uuid)
    }
  }
}

export default CreateUserSettingsRequest
