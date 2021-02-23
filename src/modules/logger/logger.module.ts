import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Log } from '../../models/log.model';
import { LoggerController } from './logger.controller';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from './logger.service';

@Module({
  imports: [SequelizeModule.forFeature([Log])],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'logs', method: RequestMethod.ALL },
        { path: 'logs/(.*)', method: RequestMethod.ALL },
        { path: 'api', method: RequestMethod.ALL },
        { path: 'api/(.*)', method: RequestMethod.ALL },
        { path: '/favicon*', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
