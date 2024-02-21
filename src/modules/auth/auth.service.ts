import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { DecodedRefreshToken } from './interfaces';
import { MailerService } from '@nestjs-modules/mailer';
import { SafeUser } from 'src/shared/types';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  removeCookie,
  removeFields,
  setCookie,
  validationCodeMail,
} from './utils';
import {
  NewPasswordDTO,
  SignInDTO,
  UsernameCodeDTO,
  ValidationCodeDTO,
} from './DTOs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  logOut(res: Response): void {
    removeCookie(res, 'refreshToken');
  }

  async validateRefreshToken(
    refreshToken: string | undefined,
  ): Promise<boolean> {
    if (!refreshToken) return false;

    const decoded: DecodedRefreshToken = await this.jwtService.verifyAsync(
      refreshToken,
      { secret: process.env.REFRESH_JWT_SECRET },
    );

    return !!decoded;
  }

  async signIn(dto: SignInDTO, res: Response): Promise<string> {
    const user = (await this.usersService.getUser(dto.username)) as User;
    const matched: boolean = await bcrypt.compare(dto.password, user.password);

    if (!matched) {
      throw new UnauthorizedException('Incorrect credentials.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        "Your account hasn't been activated yet, check your email.",
      );
    }

    const safeUser: SafeUser = removeFields(user);
    await this.generateRefreshToken(user.username, res);
    const accessToken: string = await this.generateAccessToken(safeUser);
    return accessToken;
  }

  async generateAccessToken(user: SafeUser | string): Promise<string> {
    const payload: SafeUser = await this.getUserObject(user);
    const expiresIn: number = 60 * 2; // 2m
    const secret: string = process.env.JWT_SECRET;
    return this.signToken(payload, secret, expiresIn);
  }

  async sendValidationCode(dto: UsernameCodeDTO): Promise<void> {
    const user: SafeUser = await this.usersService.getUser(dto.username, true);
    const code: string = crypto.randomBytes(5).toString('hex');

    await this.mailerService.sendMail(
      validationCodeMail(user.email, user.username, code),
    );

    const hashedCode = await bcrypt.hash(code, +process.env.HASH_SALT);
    const expiresIn = 60 * 5; //5m

    await this.usersService.patchUser(user.username, {
      recoveryCode: hashedCode,
      recoveryCodeExpires: new Date(Date.now() + expiresIn * 1000),
    });
  }

  async verifyValidationCode(
    dto: ValidationCodeDTO,
    username: string,
  ): Promise<void> {
    const user = (await this.usersService.getUser(username)) as User;

    if (!user.recoveryCode) {
      throw new NotFoundException(
        'No recovery code found. Please request a code first.',
      );
    }

    const recoveryCodeExpires = new Date(user.recoveryCodeExpires);
    const currentDateTime = new Date();

    if (currentDateTime > recoveryCodeExpires) {
      throw new UnauthorizedException(
        'Your code has expired. Please request a new one.',
      );
    }

    const isValid = await bcrypt.compare(dto.code, user.recoveryCode);

    if (!isValid) {
      throw new UnauthorizedException('The provided code is invalid.');
    }
  }

  async resetPassword(dto: NewPasswordDTO, username: string): Promise<void> {
    await this.usersService.patchUser(username, {
      password: dto.newPassword,
    });
  }

  private async generateRefreshToken(
    username: string,
    res: Response,
  ): Promise<void> {
    const payload = { username };
    const secret: string = process.env.REFRESH_JWT_SECRET;
    const expiresIn: number = 60 * 60 * 48; //48h

    const refreshToken: string = await this.signToken(
      payload,
      secret,
      expiresIn,
    );

    setCookie(res, 'refreshToken', refreshToken, expiresIn);
  }

  private async getUserObject(user: SafeUser | string): Promise<SafeUser> {
    if (typeof user !== 'string') return user;
    return await this.usersService.getUser(user, true);
  }

  private async signToken(
    data: SafeUser | { username: string },
    secret: string,
    expiresIn: number,
  ): Promise<string> {
    return await this.jwtService.signAsync(data, { secret, expiresIn });
  }
}
