import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UsernameCodeDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  @Transform((data) => data.value.toLowerCase())
  username: string;
}
