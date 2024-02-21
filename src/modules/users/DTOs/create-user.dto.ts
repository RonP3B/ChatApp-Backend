import { Transform } from 'class-transformer';
import { emailRegExp, passwordRegExp } from 'src/shared';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Transform((data) => data.value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(emailRegExp, { message: 'Invalid email format.' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  @Matches(passwordRegExp, {
    message:
      'The password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long',
  })
  password: string;
}
