import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @IsNotEmpty()
  @IsString()
  @Transform((data) => data.value.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
