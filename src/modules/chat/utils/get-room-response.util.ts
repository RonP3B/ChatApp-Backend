import { SafeUser } from 'src/shared';
import { RoomResponseDTO } from '../DTOs';
import { RoomWithRelations } from '../types';
import { setUnreadMessages } from './set-unread-messages.util';
import { setRoomProperty } from './set-room-property.util';

export function getRoomResponse(
  room: RoomWithRelations,
  user: SafeUser,
): RoomResponseDTO {
  return {
    id: room.id,
    name: setRoomProperty(room, user, 'name'),
    image: setRoomProperty(room, user, 'image'),
    unreadMessages: setUnreadMessages(room),
    isGroup: room.isGroup,
    lastMessage: room.lastMessage,
    lastMessageDate: room.lastMessageDate,
    admins: room.admins,
    participants: room.participants,
    messages: room.messages,
  };
}
