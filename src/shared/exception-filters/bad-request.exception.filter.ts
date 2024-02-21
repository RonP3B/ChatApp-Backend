import { Request, Response } from 'express';
import { deleteFile } from '../utils';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';

@Catch(BadRequestException)
export class DeleteFileOnBadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (request.file) {
      deleteFile(request.file.fieldname, request.file.filename);
    }

    response.status(status).json(exception.getResponse());
  }
}
