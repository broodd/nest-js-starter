import { join } from 'path';
import { Module } from '@nestjs/common';
import configDefault from '../config/default';
import configProduction from '../config/production';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ProductsModule } from './modules/products/products.module';

const config =
  process.env.NODE_ENV === 'production' ? configProduction : configDefault;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          dialect: config.get('database.type'),
          host: config.get('database.host'),
          port: config.get('database.port'),
          username: config.get('database.username'),
          password: config.get('database.password'),
          database: config.get('database.database'),
          synchronize: config.get('database.synchronize'),
          logging: config.get('database.logging'),
          benchmark: true,
          autoLoadModels: true,
        } as SequelizeModuleOptions;
      },
    }),
    ServeStaticModule.forRoot(
      {
        serveRoot: '/uploads',
        rootPath: join(__dirname, '..', '..', 'uploads'),
        serveStaticOptions: {
          index: false,
        },
      },
      {
        serveRoot: '/logs',
        rootPath: join(
          __dirname,
          '..',
          '..',
          'src',
          'modules',
          'logger',
          'public',
        ),
      },
      {
        serveRoot: '/chat',
        rootPath: join(
          __dirname,
          '..',
          '..',
          'src',
          'modules',
          'chat',
          'public',
        ),
      },
    ),
    AuthModule,
    ChatModule,
    UsersModule,
    ProductsModule,
    UploadsModule,
    LoggerModule,
  ],
})
export class AppModule {}
