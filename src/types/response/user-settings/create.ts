import { ApiProperty } from '@nestjs/swagger'
import { UserSettings, UserSettingsKey } from '@prisma/client'

class CreateUserSettingsResponse {
  @ApiProperty()
  private userUuid: string

  @ApiProperty()
  private key: UserSettingsKey

  @ApiProperty()
  private value: string

  @ApiProperty()
  private createdAt: Date

  @ApiProperty()
  private updatedAt: Date

  @ApiProperty()
  private uuid: string

  public getKey(): string {
    return this.key
  }

  public getValue(): string {
    return this.value
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public getUuid(): string {
    return this.uuid
  }

  public setUserUuid(userUuid: string): void {
    this.userUuid = userUuid
  }

  public setKey(key: UserSettingsKey): void {
    this.key = key
  }

  public setValue(value: string): void {
    this.value = value
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid
  }

  public getUserUuid(): string {
    return this.userUuid
  }

  public constructor(userSettings?: UserSettings, userUuid?: string) {
    if (userSettings) {
      this.setKey(userSettings.key)
      this.setValue(userSettings.value)
      this.setCreatedAt(userSettings.created_at)
      this.setUpdatedAt(userSettings.updated_at)
      this.setUuid(userSettings.uuid)
    }

    if (userUuid) {
      this.setUserUuid(userUuid)
    }
  }
}

export default CreateUserSettingsResponse
