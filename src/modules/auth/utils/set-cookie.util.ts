import { Response } from 'express';

export function setCookie(
  res: Response,
  name: string,
  value: string | object,
  expiresIn: number,
): void {
  res.cookie(name, value, {
    expires: new Date(Date.now() + expiresIn * 1000),
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  });
}
