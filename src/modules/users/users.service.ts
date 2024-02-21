import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDTO, UpdateUserDTO } from './DTOs';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { activationMail } from './utils';
import { prismaExclude } from 'prisma-exclude';
import { deleteFile, excludedUserFields } from 'src/shared/utils';
import {
  AllowedFields,
  SafeUser,
  UserOnlineStatusUpdated,
} from 'src/shared/types';

@Injectable()
export class UsersService {
  private readonly exclude: any;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {
    this.exclude = prismaExclude(databaseService);
  }

  async getUsers(username?: string): Promise<SafeUser[]> {
    return await this.databaseService.user.findMany({
      select: this.excludeHiddenFields(true),
      where: username
        ? { username: { contains: username.toLowerCase() } }
        : undefined,
    });
  }

  async getUser(
    username: string,
    excludeHidden?: boolean,
  ): Promise<SafeUser | User> {
    const user: SafeUser | User = await this.databaseService.user.findUnique({
      select: this.excludeHiddenFields(excludeHidden),
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException(`The user '${username}' does not exist.`);
    }

    return user;
  }

  async activateUser(username: string): Promise<void> {
    await this.patchUser(username, { isActive: true });
  }

  async createUser(
    dto: CreateUserDTO,
    file: Express.Multer.File,
  ): Promise<User> {
    const avatarPath: string = `${process.env.API_HOST}${file.path}`;
    dto.password = await bcrypt.hash(dto.password, +process.env.HASH_SALT);

    const createdUser: User = await this.databaseService.user.create({
      data: { avatar: avatarPath, ...dto },
    });

    await this.mailerService.sendMail(
      activationMail(createdUser.email, createdUser.username),
    );

    return createdUser;
  }

  async patchUser(
    username: string,
    dto: UpdateUserDTO,
    file?: Express.Multer.File,
  ): Promise<User> {
    if (file) {
      dto['avatar'] = `${process.env.API_HOST}${file.path}`;
      const avatarPath: string = (await this.getUser(username)).avatar;
      deleteFile('avatar', avatarPath);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, +process.env.HASH_SALT);
    }

    return await this.databaseService.user.update({
      where: { username: username.toLowerCase() },
      data: dto,
    });
  }

  async deleteUser(username: string): Promise<void> {
    const avatarPath: string = (await this.getUser(username)).avatar;
    await this.databaseService.user.delete({
      where: { username: username.toLowerCase() },
    });
    deleteFile('avatar', avatarPath);
  }

  async setUserOnlineStatus(
    id: string,
    isOnline: boolean,
  ): Promise<UserOnlineStatusUpdated> {
    return await this.databaseService.user.update({
      where: { id },
      data: { isOnline },
      select: { id: true, isOnline: true, rooms: { select: { id: true } } },
    });
  }

  async getOnlineUsersInRelatedRooms(id: string): Promise<{ id: string }[]> {
    return await this.databaseService.user.findMany({
      select: { id: true },
      distinct: ['id'],
      where: {
        isOnline: true,
        rooms: { some: { participants: { some: { id } } } },
      },
    });
  }

  private excludeHiddenFields(excludeHidden?: boolean): AllowedFields {
    return excludeHidden ? this.exclude('user', excludedUserFields) : undefined;
  }
}
