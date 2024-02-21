import { Module } from '@nestjs/common';
import { ChatUserController } from './chat-user.controller';
import { ChatUserService } from './chat-user.service';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [ChatUserController],
  providers: [ChatUserService],
})
export class ChatUserModule {}
