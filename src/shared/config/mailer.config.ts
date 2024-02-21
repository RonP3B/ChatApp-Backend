import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    secure: false,
    port: 587,
    auth: {
      user: 'chat.app.communication@gmail.com',
      pass: process.env.MAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
};
