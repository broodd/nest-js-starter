import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as responseTime from 'response-time';

import { ErrorInterceptor } from './interceptors/error.interceptor';
import { setupSwagger } from './helpers/swagger';
import { setupFirebase } from './helpers/firebase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(responseTime({ digits: 0, suffix: false }));
  app.enableCors();

  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: errors => new BadRequestException(errors),
    }),
  );

  setupFirebase();
  setupSwagger(app);

  const port = app.get('ConfigService').get('server.port');
  await app.listen(port);
}
bootstrap();
