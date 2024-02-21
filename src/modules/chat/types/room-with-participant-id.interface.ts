import { Room } from '@prisma/client';

export type RoomWithParticipantIds = {
  participants: { id: string }[];
} & Room;
