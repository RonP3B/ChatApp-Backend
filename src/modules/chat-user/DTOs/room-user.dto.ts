import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RoomUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId: string;
}
