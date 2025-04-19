import { Injectable } from '@nestjs/common';
import { Message, User } from '@prisma/client';
import PrismaService from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  //  Obter data atual
  private getCurrentDate(): Date {
    return new Date();
  }

  //  Criar uma nova mensagem
  public async create(message: Omit<Message, 'id' | 'uuid' | 'timestamp'>): Promise<Message> {
    const newMessage = await this.prisma.message.create({
      data: {
        ...message,
        uuid: uuidv4(), // Gera um UUID único para a mensagem
        timestamp: this.getCurrentDate(), // Define o timestamp atual para a mensagem
      },
    });
    return newMessage;
  }

  //  Obter uma mensagem pelo ID
  public async getById(id: number): Promise<Message | null> {
    return await this.prisma.message.findUnique({
      where: { id },
    });
  }

  //  Obter uma mensagem pelo UUID
  public async getByUuid(uuid: string): Promise<Message | null> {
    return await this.prisma.message.findUnique({
      where: { uuid },
    });
  }

  //  Obter todas as mensagens de um chat específico
  public async getByChatId(chat_id: number): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        chat_id,  

      },
      orderBy: {
        timestamp: 'asc',
      },
    }); 
  }
  //  Obter todas as mensagens enviadas por um usuário específico
  public async getByUserId(user_id: number): Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: { user_id },
    });
  }

  //  Atualizar uma mensagem
  public async update(id: number, data: Partial<Message>): Promise<Message> {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new Error('Mensagem não encontrada');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: {
        ...data,
        timestamp: this.getCurrentDate(), // Atualiza o timestamp da mensagem
      },
    });
    return updatedMessage;
  }

  //  Deletar uma mensagem
  public async delete(id: number): Promise<Message> {
    const existingMessage = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new Error('Mensagem não encontrada');
    }

    const deletedMessage = await this.prisma.message.delete({
      where: { id },
    });
    return deletedMessage;
  }

  //  Obter a mensagem junto com o usuário associado
  public async getWithUser(id: number): Promise<Message & { user: User } | null> {
    return await this.prisma.message.findUnique({
      where: { id },
      include: {
        user: true, // Inclui os dados do usuário relacionado à mensagem
      },
    });
  }

  //  Buscar mensagens de um chat com a possibilidade de paginar resultados
  public async getMessagesWithPagination(
    chatId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Message[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.message.findMany({
      where: { chat_id: chatId },
      skip,
      take: limit,
      orderBy: {
        timestamp: 'asc', 
      },
    });
  }
}

export default MessageRepository;
