import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDTO, UpdateUserDTO } from './DTOs';
import { ExcludeFieldsInterceptor } from './interceptors';
import { FileInterceptor } from '@nestjs/platform-express';
import { SafeUser } from 'src/shared/types';
import { AccessTokenGuard } from 'src/shared/guards';
import { fileStorage } from 'src/shared/utils';
import { CustomFileValidationPipe } from 'src/shared/pipes';
import { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('username') username?: string): Promise<SafeUser[]> {
    return await this.usersService.getUsers(username);
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<SafeUser> {
    return await this.usersService.getUser(username, true);
  }

  @Get('activation/:username')
  async getUserActivation(@Param('username') username: string): Promise<void> {
    await this.usersService.activateUser(username);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', fileStorage('avatar')),
    ExcludeFieldsInterceptor,
  )
  async createUser(
    @Body() dto: CreateUserDTO,
    @UploadedFile(new CustomFileValidationPipe(true)) file: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.createUser(dto, file);
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('avatar', fileStorage('avatar')),
    ExcludeFieldsInterceptor,
  )
  async patchUser(
    @Body() dto: UpdateUserDTO,
    @Req() req: Request,
    @UploadedFile(new CustomFileValidationPipe(false))
    file: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.patchUser(req.user.username, dto, file);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  async deleteUser(@Req() req: Request): Promise<void> {
    await this.usersService.deleteUser(req.user.username);
  }
}
