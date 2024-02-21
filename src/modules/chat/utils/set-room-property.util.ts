import { SafeUser } from 'src/shared';
import { RoomWithRelations } from '../types';

export function setRoomProperty(
  room: RoomWithRelations,
  user: SafeUser,
  propertyType: 'name' | 'image',
): string {
  let property: string;

  if (room.isGroup) {
    property = propertyType === 'name' ? room.name : room.groupImage;
  } else {
    const participant = room.participants.find(
      (participant) => participant.id !== user.id,
    );
    property =
      propertyType === 'name' ? participant.username : participant.avatar;
  }

  return property;
}
