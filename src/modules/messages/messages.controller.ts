import { MessagesService } from './messages.service';
import { SentMessageDTO } from './DTOs';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/shared/guards';
import { fileStorage } from 'src/shared/utils';
import { CustomFileValidationPipe } from 'src/shared/pipes';
import { Message } from '@prisma/client';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@UseGuards(AccessTokenGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment', fileStorage('attachment')))
  async sendMessage(
    @Body() dto: SentMessageDTO,
    @UploadedFile(new CustomFileValidationPipe(false))
    file: Express.Multer.File,
  ): Promise<Message> {
    return await this.messagesService.sendMessage(dto, file);
  }
}
