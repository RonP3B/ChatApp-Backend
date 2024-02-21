import { Message } from '@prisma/client';
import { SafeUser } from 'src/shared';

export class RoomResponseDTO {
  id: string;
  name: string;
  image: string;
  isGroup: boolean;
  lastMessage: string | null;
  lastMessageDate: Date | null;
  admins: SafeUser[];
  participants: SafeUser[];
  messages: Message[];
  unreadMessages: number;
}
