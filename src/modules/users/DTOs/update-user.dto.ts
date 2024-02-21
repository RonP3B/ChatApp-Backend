import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  recoveryCode?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDate()
  recoveryCodeExpires?: Date;
}
