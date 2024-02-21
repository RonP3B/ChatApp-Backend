import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly notFoundCodes: string[] = [
    'P2001',
    'P2015',
    'P2018',
    'P2025',
  ];

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception.code === 'P2002') {
      statusCode = HttpStatus.CONFLICT;
      message = `The given ${exception?.meta?.target} is already taken. Please try a different one.`;
    }

    if (this.notFoundCodes.includes(exception.code)) {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Requested record not found.';
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
