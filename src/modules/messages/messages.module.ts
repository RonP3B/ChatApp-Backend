import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { ChatModule } from '../chat/chat.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [DatabaseModule, JwtModule, SocketModule, ChatModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
