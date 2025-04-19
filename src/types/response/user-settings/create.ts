import { ApiProperty } from '@nestjs/swagger'
import { UserSettings, UserSettingsKey } from '@prisma/client'

class CreateUserSettingsResponse {
  @ApiProperty()
  private userId: number

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

  @ApiProperty()
  private id: number

  public getUserId(): number {
    return this.userId
  }

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

  public getId(): number {
    return this.id
  }

  public setUserId(userId: number): void {
    this.userId = userId
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

  public setId(id: number): void {
    this.id = id
  }

  public constructor(userSettings?: UserSettings) {
    if (userSettings) {
      this.setUserId(userSettings.user_id)
      this.setKey(userSettings.key)
      this.setValue(userSettings.value)
      this.setCreatedAt(userSettings.created_at)
      this.setUpdatedAt(userSettings.updated_at)
      this.setUuid(userSettings.uuid)
      this.setId(userSettings.id)
    }
  }

  public toUserSettings(): UserSettings {
    return {
      user_id: this.userId,
      key: this.key,
      value: this.value,
      id: this.id,
      uuid: this.uuid,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    }
  }
}

export default CreateUserSettingsResponse
