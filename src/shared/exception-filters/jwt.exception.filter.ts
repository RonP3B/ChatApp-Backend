import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch(JsonWebTokenError, TokenExpiredError)
export class JWTExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = HttpStatus.UNAUTHORIZED;
    let message = 'JWT validation error.';

    if (exception instanceof JsonWebTokenError) {
      message = 'Invalid token.';
    } else if (exception instanceof TokenExpiredError) {
      message = 'Token expired.';
    }

    response.status(statusCode).json({ statusCode, message });
  }
}
