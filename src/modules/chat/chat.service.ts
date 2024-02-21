import { DatabaseService } from '../database/database.service';
import { Room } from '@prisma/client';
import { SafeUser, excludedUserFields } from 'src/shared';
import { RoomWithParticipantIds, RoomWithRelations } from './types';
import { prismaExclude } from 'prisma-exclude';
import { CreateGroupRoomDTO, CreateRoomDTO, RoomResponseDTO } from './DTOs';
import { SocketService } from '../socket/socket.service';
import { getRoomResponse } from './utils';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly exclude: any;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly socketService: SocketService,
  ) {
    this.exclude = prismaExclude(databaseService);
  }

  async getRoom(id: string): Promise<Room> {
    const room: Room = await this.databaseService.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`The chat room was not found.`);
    }

    return room;
  }

  async getRooms(user: SafeUser): Promise<RoomResponseDTO[]> {
    const rooms = (await this.databaseService.room.findMany({
      where: { participants: { some: { id: user.id } } },
      include: {
        admins: { select: this.exclude('user', excludedUserFields) },
        lastCheckedByUsers: { where: { userId: user.id } },
        participants: { select: this.exclude('user', excludedUserFields) },
        messages: {
          include: {
            sender: { select: this.exclude('user', excludedUserFields) },
          },
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { lastMessageDate: 'desc' },
    })) as unknown as RoomWithRelations[];

    const roomsResponse: RoomResponseDTO[] = rooms.map((room) => {
      return getRoomResponse(room, user);
    });

    return roomsResponse;
  }

  async createRoom(
    dto: CreateRoomDTO,
    user: SafeUser,
  ): Promise<RoomResponseDTO> {
    const isRoomAlreadyCreated = await this.databaseService.room.findFirst({
      where: {
        participants: { some: { id: dto.participantId } },
        AND: [{ participants: { some: { id: user.id } } }, { isGroup: false }],
      },
    });

    if (isRoomAlreadyCreated) {
      throw new BadRequestException(
        'The chat room you are attempting to create already exists.',
      );
    }

    const newRoom = (await this.databaseService.room.create({
      data: {
        isGroup: false,
        admins: { connect: { id: user.id } },
        participants: {
          connect: [{ id: dto.participantId }, { id: user.id }],
        },
      },
      include: {
        participants: { select: this.exclude('user', excludedUserFields) },
        admins: { select: this.exclude('user', excludedUserFields) },
        lastCheckedByUsers: true,
        messages: true,
      },
    })) as unknown as RoomWithRelations;

    newRoom.participants.forEach((participant) => {
      if (participant.id === user.id) return;
      this.socketService.emitRoomCreated(
        participant.id,
        getRoomResponse(newRoom, participant),
      );
    });

    return getRoomResponse(newRoom, user);
  }

  async createGroupRoom(
    dto: CreateGroupRoomDTO,
    user: SafeUser,
    file: Express.Multer.File,
  ): Promise<RoomResponseDTO> {
    const participants: string[] = [
      ...new Set([user.id, ...dto.participantIds]),
    ]; // Removes duplicated participant IDs

    if (participants.length < 3) {
      throw new BadRequestException(
        'Duplicate participants have been detected.',
      );
    }

    const newGroupRoom = (await this.databaseService.room.create({
      data: {
        isGroup: true,
        name: dto.groupName,
        groupImage: `${process.env.API_HOST}${file.path}`,
        admins: { connect: { id: user.id } },
        participants: {
          connect: participants.map((participantId) => ({ id: participantId })),
        },
      },
      include: {
        participants: { select: this.exclude('user', excludedUserFields) },
        admins: { select: this.exclude('user', excludedUserFields) },
        lastCheckedByUsers: true,
        messages: true,
      },
    })) as unknown as RoomWithRelations;

    newGroupRoom.participants.forEach((participant) => {
      if (participant.id === user.id) return;
      this.socketService.emitRoomCreated(
        participant.id,
        getRoomResponse(newGroupRoom, participant),
      );
    });

    return getRoomResponse(newGroupRoom, user);
  }

  async updateLastMessage(
    roomId: string,
    message: string,
  ): Promise<{ id: string }[]> {
    const updatedRoom: RoomWithParticipantIds =
      await this.databaseService.room.update({
        where: { id: roomId },
        data: { lastMessage: message, lastMessageDate: new Date() },
        include: { participants: { select: { id: true } } },
      });

    return updatedRoom.participants;
  }
}
