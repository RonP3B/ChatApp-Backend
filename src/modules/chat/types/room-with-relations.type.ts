import { Prisma } from '@prisma/client';

export type RoomWithRelations = Prisma.RoomGetPayload<{
  include: {
    admins: { select: SelectSafeUser };
    participants: { select: SelectSafeUser };
    messages: { include: { sender: { select: SelectSafeUser } } };
    lastCheckedByUsers: true;
  };
}>;

interface SelectSafeUser {
  id: true;
  avatar: true;
  username: true;
  email: true;
  isOnline: true;
}
