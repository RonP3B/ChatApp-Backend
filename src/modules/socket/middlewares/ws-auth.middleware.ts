import { JwtService } from '@nestjs/jwt';
import { ISocket } from 'socket.io';
import { UsersService } from 'src/modules/users/users.service';
import { SocketMiddleware } from '../types';

export const WSAuthMiddleware = (
  jwtService: JwtService,
  usersService: UsersService,
): SocketMiddleware => {
  const errorNext = {
    name: 'Unauthorized',
    message: 'Missing or invalid token',
  };

  return async (client: ISocket, next) => {
    try {
      const token: string = client.handshake.auth?.token;
      const { id, username } = await jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      await usersService.getUser(username || ''); //throws exception if user is not found
      client.uid = id;
      client.join(client.uid);
      next();
    } catch (error) {
      next(errorNext);
    }
  };
};
