export type UserOnlineStatusUpdated = {
  id: string;
  isOnline: boolean;
  rooms: { id: string }[];
};
