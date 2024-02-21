import { User } from '@prisma/client';

export type SafeUser = Omit<
  User,
  'password' | 'recoveryCode' | 'recoveryCodeExpires' | 'isActive'
>;
