import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Photo } from '../../models/photo.model';

@Module({
  imports: [
    ConfigService,
    SequelizeModule.forFeature([Photo]),
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file: Express.Multer.File, cb) => {
          const date = new Date().toISOString().replace(/:/g, '_');
          const name = file.originalname.toLowerCase().replace(/[\s]/g, '_');
          cb(undefined, `${date}-${name}`);
        },
      }),
      fileFilter: (_req, file: Express.Multer.File, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Accept format: jpg, jpeg, png, gif'),
            false,
          );
        }

        cb(undefined, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
