import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { corsConfig } from './shared/config';
import {
  DeleteFileOnBadRequestExceptionFilter,
  JWTExceptionFilter,
  PrismaExceptionFilter,
} from './shared/exception-filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' });
  app.setGlobalPrefix('api/v1');
  app.enableCors(corsConfig);
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new JWTExceptionFilter(),
    new DeleteFileOnBadRequestExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(port);
}
bootstrap();
