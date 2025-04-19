import { ApiProperty } from '@nestjs/swagger'

class CreateMessageRequest {
  @ApiProperty()
  private content: string

  @ApiProperty()
  private userUuid: string

  @ApiProperty()
  private chatUuid: string

  public getContent(): string {
    return this.content
  }

  public getUserUuid(): string {
    return this.userUuid
  }

  public getChatUuid(): string {
    return this.chatUuid
  }

  public setContent(content: string): void {
    this.content = content
  }

  public setUserUuid(userUuid: string): void {
    this.userUuid = userUuid
  }

  public setChatUuid(chatUuid: string): void {
    this.chatUuid = chatUuid
  }
}

export default CreateMessageRequest
