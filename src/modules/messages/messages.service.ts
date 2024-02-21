import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { SentMessageDTO } from './DTOs';
import { Message, MessageType } from '@prisma/client';
import { ChatService } from '../chat/chat.service';
import { prismaExclude } from 'prisma-exclude';
import { excludedUserFields } from 'src/shared';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class MessagesService {
  private readonly exclude: any;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly chatService: ChatService,
    private readonly socketService: SocketService,
  ) {
    this.exclude = prismaExclude(databaseService);
  }

  async sendMessage(
    dto: SentMessageDTO,
    file: Express.Multer.File,
  ): Promise<Message> {
    const { content, senderId, senderName, messageType, roomId } = dto;

    if (!content && !file) {
      throw new BadRequestException(
        'Please provide either message content or an attachment.',
      );
    }

    let lastMessage: string = content;
    let message: string = content;

    if (!content && messageType !== MessageType.TEXT && file) {
      message = `${process.env.API_HOST}${file.path}`;
      lastMessage = `${file.mimetype.split('/')[0]} sent.`;
    }

    if (senderName) {
      lastMessage = `${senderName}: ${lastMessage}`;
    }

    const newMessage: Message = await this.databaseService.message.create({
      data: { content: message, senderId, messageType, roomId },
      include: {
        sender: { select: this.exclude('user', excludedUserFields) },
      },
    });

    const participantIds = await this.chatService.updateLastMessage(
      roomId,
      lastMessage,
    );

    this.socketService.emitMessageReceived(
      participantIds,
      senderId,
      newMessage,
    );

    return newMessage;
  }
}
