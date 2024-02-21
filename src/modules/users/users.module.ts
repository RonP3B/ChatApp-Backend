import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from 'src/shared/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, MailerModule.forRoot(mailerConfig), JwtModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
