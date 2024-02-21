import { Response } from 'express';

export function removeCookie(res: Response, name: string): void {
  res.clearCookie(name, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
}
