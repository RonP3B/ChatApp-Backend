import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @IsUUID()
  participantId: string;
}
