import { Injectable } from '@nestjs/common'
import { Chat, Message, User } from '@prisma/client'
import PrismaService from 'src/prisma.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Criar um novo chat
  public async create(chat: Omit<Chat, 'id' | 'uuid' | 'created_at' | 'updated_at'>): Promise<Chat> {
    const newChat = await this.prisma.chat.create({
      data: {
        ...chat,
        uuid: uuidv4(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    return newChat
  }

  // Buscar chat por ID
  public async getById(id: Chat['id']): Promise<Chat | null> {
    return await this.prisma.chat.findUnique({
      where: { id },
    })
  }

  // Buscar chat por UUID
  public async getByUuid(uuid: Chat['uuid']): Promise<Chat | null> {
    return await this.prisma.chat.findUnique({
      where: { uuid },
    })
  }

  // Buscar todos os chats de um user
  public async getByUserId(user_id: User['id']): Promise<Chat[]> {
    return await this.prisma.chat.findMany({
      where: { user_id },
    })
  }

  // Buscar todos os chats
  public async getAll(): Promise<Chat[]> {
    return await this.prisma.chat.findMany()
  }

  // Atualizar informações de um chat
  public async update(id: Chat['id'], data: Partial<Chat>): Promise<Chat> {
    return await this.prisma.chat.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })
  }

  // Apagar um chat
  public async delete(id: Chat['id']): Promise<Chat> {
    return await this.prisma.chat.delete({
      where: { id },
    })
  }

  // Buscar chat com as mensagens
  public async getWithMessages(id: Chat['id']): Promise<(Chat & { messages: Message[] }) | null> {
    return await this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    })
  }

  // Exemplo de método que pode ser utilizado para buscar chats com filtros e ordenação
  public async getChatsWithFilter(userId: User['id'], page: number = 1, limit: number = 10): Promise<Chat[]> {
    const skip = (page - 1) * limit

    return await this.prisma.chat.findMany({
      where: { user_id: userId },
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    })
  }
}

export default ChatRepository
