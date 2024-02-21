import { MessageType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class SentMessageDTO {
  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  senderName: string;

  @IsNotEmpty()
  @IsEnum(MessageType)
  messageType: MessageType;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId: string;
}
