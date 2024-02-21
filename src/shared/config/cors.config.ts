import { HttpException, HttpStatus } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const whiteList: string[] = [process.env.ORIGIN1];

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) return callback(null, origin);
    const errorMessage = `CORS origin '${origin}' unauthorized`;
    return callback(new HttpException(errorMessage, HttpStatus.FORBIDDEN));
  },
  credentials: true,
};
