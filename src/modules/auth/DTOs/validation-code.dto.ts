import { IsNotEmpty, IsString } from 'class-validator';

export class ValidationCodeDTO {
  @IsNotEmpty()
  @IsString()
  code: string;
}
