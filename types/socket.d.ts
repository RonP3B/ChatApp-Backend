import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface ISocket extends Socket {
    uid: string;
  }
}
