import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards';
import { Response, Request } from 'express';
import { AccessTokenGuard } from 'src/shared/guards';
import {
  NewPasswordDTO,
  SignInDTO,
  UsernameCodeDTO,
  ValidationCodeDTO,
} from './DTOs';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('log-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  logOut(@Res() res: Response): void {
    this.authService.logOut(res);
    res.send();
  }

  @UseGuards(RefreshTokenGuard)
  @Get('access-token')
  async refreshAccessToken(
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const accessToken: string = await this.authService.generateAccessToken(
      req.username,
    );
    return { accessToken };
  }

  @Get('valid-refresh-token')
  async validateRefreshToken(
    @Req() req: Request,
  ): Promise<{ isValidRefreshToken: boolean }> {
    const isValidRefreshToken: boolean =
      await this.authService.validateRefreshToken(req.cookies.refreshToken);
    return { isValidRefreshToken };
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDTO, @Res() res: Response): Promise<void> {
    const accessToken: string = await this.authService.signIn(dto, res);
    res.json({ accessToken });
  }

  @Post('recovery/send-code')
  @HttpCode(HttpStatus.ACCEPTED)
  async sendValidationCode(@Body() dto: UsernameCodeDTO): Promise<void> {
    await this.authService.sendValidationCode(dto);
  }

  @Post('recovery/verify-code/:username')
  @HttpCode(HttpStatus.ACCEPTED)
  async verifyValidationCode(
    @Body() dto: ValidationCodeDTO,
    @Param('username') username: string,
  ): Promise<void> {
    await this.authService.verifyValidationCode(dto, username);
  }

  @Patch('recovery/reset-password/:username')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body() dto: NewPasswordDTO,
    @Param('username') username: string,
  ): Promise<void> {
    await this.authService.resetPassword(dto, username);
  }
}
