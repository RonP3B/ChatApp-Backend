import { passwordRegExp } from 'src/shared';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class NewPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  @Matches(passwordRegExp, {
    message:
      'The password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long',
  })
  newPassword: string;
}
