import { ApiProperty } from '@nestjs/swagger'
import { User, UserSettings, UserSettingsKey } from '@prisma/client'

class CreateUserSettingsRequest {
  @ApiProperty()
  private key: UserSettingsKey

  @ApiProperty()
  private value: string

  @ApiProperty()
  private userUuid: string

  private createdAt: Date
  private updatedAt: Date
  private id: number
  private uuid: string

  public getKey(): UserSettingsKey {
    return this.key
  }

  public setKey(key: UserSettingsKey): void {
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

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt
  }

  public getId(): number {
    return this.id
  }

  public setId(id: number): void {
    this.id = id
  }

  public getUuid(): string {
    return this.uuid
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid
  }

  public toUserSettings(user: User): UserSettings {
    return {
      key: this.key,
      value: this.value,
      user_id: user.id,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      id: this.id,
      uuid: this.uuid,
    }
  }

  public constructor(userSettings?: UserSettings, user?: User) {
    if (userSettings && user) {
      this.setKey(userSettings.key)
      this.setValue(userSettings.value)
      this.setUserUuid(user.uuid)
      this.setCreatedAt(userSettings.created_at)
      this.setUpdatedAt(userSettings.updated_at)
      this.setId(userSettings.id)
      this.setUuid(userSettings.uuid)
    }
  }
}

export default CreateUserSettingsRequest
