import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/shared/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
