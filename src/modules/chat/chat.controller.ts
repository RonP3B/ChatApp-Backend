import { AccessTokenGuard } from 'src/shared/guards';
import { ChatService } from './chat.service';
import { fileStorage } from 'src/shared/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFileValidationPipe } from 'src/shared/pipes';
import { Request } from 'express';
import { CreateGroupRoomDTO, CreateRoomDTO, RoomResponseDTO } from './DTOs';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@UseGuards(AccessTokenGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getRooms(@Req() req: Request): Promise<RoomResponseDTO[]> {
    return await this.chatService.getRooms(req.user);
  }

  @Post()
  async createRoom(
    @Body() dto: CreateRoomDTO,
    @Req() req: Request,
  ): Promise<RoomResponseDTO> {
    return await this.chatService.createRoom(dto, req.user);
  }

  @Post('group')
  @UseInterceptors(FileInterceptor('groupImage', fileStorage('avatar')))
  async createGroupRoom(
    @Body() dto: CreateGroupRoomDTO,
    @Req() req: Request,
    @UploadedFile(new CustomFileValidationPipe(true))
    file: Express.Multer.File,
  ): Promise<RoomResponseDTO> {
    return await this.chatService.createGroupRoom(dto, req.user, file);
  }
}
