import { ApiProperty } from '@nestjs/swagger'
import { Chat, User } from '@prisma/client'

class CreateChatResponse {
  @ApiProperty()
  private uuid: string

  @ApiProperty()
  private userUuid: string

  @ApiProperty()
  private title: string

  @ApiProperty()
  private createdAt: Date

  @ApiProperty()
  private updatedAt: Date

  public getUuid(): string {
    return this.uuid
  }

  public setUuid(uuid: string): void {
    this.uuid = uuid
  }

  public getUserUuid(): string {
    return this.userUuid
  }

  public setUserUuid(userUuid: string): void {
    this.userUuid = userUuid
  }

  public getTitle(): string {
    return this.title
  }

  public setTitle(title: string): void {
    this.title = title
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

  constructor(chat: Chat, user: User) {
    this.uuid = chat.uuid
    this.title = chat.title
    this.createdAt = chat.created_at
    this.updatedAt = chat.updated_at
    this.userUuid = user.uuid
  }
}

export default CreateChatResponse
