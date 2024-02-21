import { ISocket, Server } from 'socket.io';
import { SocketService } from './socket.service';
import { corsConfig } from 'src/shared';
import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: corsConfig })
export class SocketGateway {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  public server: Server;

  afterInit(server: Server): void {
    this.socketService.initSocket(server);
  }

  async handleConnection(client: ISocket): Promise<void> {
    await this.socketService.handleConnection(client);
  }

  async handleDisconnect(@ConnectedSocket() client: ISocket): Promise<void> {
    await this.socketService.handleDisconnection(client);
  }
}
