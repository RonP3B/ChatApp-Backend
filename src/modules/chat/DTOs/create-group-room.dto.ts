import {
  IsArray,
  ArrayMinSize,
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGroupRoomDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  groupName: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'At least two participantIds are required' })
  @IsUUID(undefined, {
    each: true,
    message: 'Each participantId must be a valid UUID',
  })
  participantIds: string[];
}
