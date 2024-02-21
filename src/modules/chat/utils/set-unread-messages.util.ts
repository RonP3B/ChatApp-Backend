import { RoomWithRelations } from '../types';

export function setUnreadMessages(room: RoomWithRelations): number {
  if (room.lastCheckedByUsers.length === 0) return 0;

  const lastCheckedAt: Date | undefined =
    room.lastCheckedByUsers[0]?.lastChecked;

  if (!lastCheckedAt) return room.messages.length;

  let unreadMessages: number = 0;
  let messageIdx: number = room.messages.length - 1;

  while (messageIdx >= 0) {
    if (room.messages[messageIdx--].date <= lastCheckedAt) break;
    unreadMessages++;
  }

  return unreadMessages;
}
