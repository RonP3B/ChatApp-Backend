import { Body, Controller, Put } from '@nestjs/common';
import { ChatUserService } from './chat-user.service';
import { RoomUserDTO } from './DTOs';

@Controller('chat-user')
export class ChatUserController {
  constructor(private readonly chatUserService: ChatUserService) {}

  @Put('last-checked')
  async upsertLastChecked(@Body() dto: RoomUserDTO): Promise<void> {
    await this.chatUserService.upsertLastChecked(dto.roomId, dto.userId);
  }
}
