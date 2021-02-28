import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { memoryStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Media } from '../../models/media.model';
import { S3Service } from '../../helpers/s3.service';

@Module({
  imports: [
    ConfigService,
    SequelizeModule.forFeature([Media]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, S3Service],
  exports: [MediaService],
})
export class MediaModule {}
