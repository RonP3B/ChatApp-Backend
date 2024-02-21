import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Message } from '@prisma/client';
import { ISocket, Server } from 'socket.io';
import { SocketEvent } from 'src/shared/enums';
import { RoomResponseDTO } from '../chat/DTOs';
import { UsersService } from '../users/users.service';
import { UserOnlineStatusUpdated } from 'src/shared';
import { WSAuthMiddleware } from './middlewares';

@Injectable()
export class SocketService {
  private socket: Server = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  initSocket(server: Server): void {
    this.socket = server;
    const middle = WSAuthMiddleware(this.jwtService, this.usersService);
    server.use(middle);
  }

  async handleConnection(client: ISocket): Promise<void> {
    await this.handleUserOnllneStatus(client.uid, true);
  }

  async handleDisconnection(client: ISocket): Promise<void> {
    await this.handleUserOnllneStatus(client.uid, false);
  }

  emitRoomCreated(userId: string, room: RoomResponseDTO): void {
    this.socket.to(userId).emit(SocketEvent.ROOM_CREATED, room);
  }

  emitMessageReceived(
    idArray: { id: string }[],
    except: string,
    message: Message,
  ): void {
    this.socket
      .to(idArray.map((obj) => obj.id))
      .except(except)
      .emit(SocketEvent.MESSAGE_RECEIVED, message);
  }

  private emitUserOnlineStatus(
    idArray: { id: string }[],
    user: UserOnlineStatusUpdated,
  ): void {
    this.socket
      .to(idArray.map((obj) => obj.id))
      .except(user.id)
      .emit(SocketEvent.USER_ONLINE_STATUS, user);
  }

  private async handleUserOnllneStatus(
    id: string,
    onlineStatus: boolean,
  ): Promise<void> {
    try {
      const userUpdated: UserOnlineStatusUpdated =
        await this.usersService.setUserOnlineStatus(id, onlineStatus);

      const onlineUserInRelatedRoomsIds: { id: string }[] =
        await this.usersService.getOnlineUsersInRelatedRooms(id);

      this.emitUserOnlineStatus(onlineUserInRelatedRoomsIds, userUpdated);
    } catch (error) {
      console.log(error);
    }
  }
}
