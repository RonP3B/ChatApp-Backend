import { User } from '@prisma/client';
import { SafeUser } from 'src/shared/types';
import { excludedUserFields } from 'src/shared/utils';

export function removeFields(user: User): SafeUser {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !excludedUserFields.includes(key)),
  ) as SafeUser;
}
