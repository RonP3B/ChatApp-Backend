import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatUserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async upsertLastChecked(roomId: string, userId: string): Promise<void> {
    await this.databaseService.roomLastChecked.upsert({
      where: { userId_roomId: { userId, roomId } },
      create: { roomId, userId, lastChecked: new Date() },
      update: { lastChecked: new Date() },
    });
  }
}
