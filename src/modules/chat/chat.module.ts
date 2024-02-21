import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [DatabaseModule, JwtModule, SocketModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
