import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Photo } from '../../models/photo.model';
import { User } from '../../models/user.model';
import { promises as fsPromises } from 'fs';
import { URL } from 'url';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Photo)
    private photoModel: typeof Photo,

    private config: ConfigService,
  ) {}

  async uploadFile(files: [], user: User) {
    const photos = await Promise.all(
      files.map(async ({ filename }) => {
        const src = `${this.config.get('server.baseUrl')}/uploads/${filename}`;

        return {
          src,
          authorId: user.id,
        };
      }),
    );

    return await this.photoModel.bulkCreate(photos);
  }

  async deleteFile(id: number, user: User) {
    const photo = await this.photoModel.findByPk(id);

    if (!photo) {
      throw new NotFoundException('error.notFound.file');
    }

    if (photo.authorId !== user.id) {
      throw new ForbiddenException('error.forbidden');
    }

    const path = new URL(photo.src).pathname;

    if (!path) {
      throw new NotFoundException('error.notFound.file');
    }

    try {
      await fsPromises.unlink(join(__dirname, '..', '..', '..', '..', path));
    } catch (error) {
      throw new BadRequestException('error.delete.file');
    }

    await this.photoModel.destroy({
      where: {
        id,
      },
    });
  }
}
