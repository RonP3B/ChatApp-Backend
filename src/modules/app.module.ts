import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { SocketModule } from './socket/socket.module';
import { ChatUserModule } from './chat-user/chat-user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ChatModule,
    ChatUserModule,
    MessagesModule,
    SocketModule,
    DatabaseModule,
  ],
})
export class AppModule {}
