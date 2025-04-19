import { ApiProperty } from '@nestjs/swagger'
import { Chat, Message } from '@prisma/client'

class GetMessageResponse {
  @ApiProperty()
  private uuid: string

  @ApiProperty()
  private chatUuid: string

  @ApiProperty()
  private content: string

  @ApiProperty()
  private createdAt: Date

  @ApiProperty()
  private updatedAt: Date

  @ApiProperty()
  private isAgent: boolean

  public getUuid(): string {
    return this.uuid
  }

  public getContent(): string {
    return this.content
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public getChatUuid(): string {
    return this.chatUuid
  }

  public getIsAgent(): boolean {
    return this.isAgent
  }

  constructor(message: Message, chat: Chat) {
    this.uuid = message.uuid
    this.content = message.content
    this.createdAt = message.created_at
    this.isAgent = message.is_agent
    this.chatUuid = chat.uuid
  }
}

export default GetMessageResponse
