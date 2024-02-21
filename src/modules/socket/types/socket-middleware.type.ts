import { ISocket } from 'socket.io';

export type SocketMiddleware = (
  client: ISocket,
  next: (err?: Error) => void,
) => void;
