import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Media } from '../../models/media.model';
import { User } from '../../models/user.model';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { S3Service } from '../../helpers/s3.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media)
    private mediaModel: typeof Media,

    private s3: S3Service,
  ) {}

  async uploadFile(
    { mimetype, originalname, size, buffer }: Express.Multer.File,
    user: User,
  ) {
    const type = mimetype.includes('audio')
      ? 'audio'
      : mimetype.includes('image')
      ? 'image'
      : null;

    if (!type) {
      throw new BadRequestException('error.media.wrongFileType');
    }

    const ext = extname(originalname);

    if (!ext) {
      throw new BadRequestException('error.media');
    }

    const extension = ext.slice(1);

    const filename = `${type}/${uuid()}`;

    const promises =
      type === 'image'
        ? [
            this.s3.uploadS3(buffer, `${filename}${ext}`, mimetype),
            this.s3.uploadS3(
              await this.s3.resizeImage(buffer, 300, 300, 'outside'),
              `${filename}_300${ext}`,
              mimetype,
            ),
            this.s3.uploadS3(
              await this.s3.resizeImage(buffer, 720, 720, 'inside'),
              `${filename}_720${ext}`,
              mimetype,
            ),
          ]
        : [this.s3.uploadS3(buffer, `${filename}${ext}`, mimetype)];

    const [src, srcSmall, srcMedium] = await Promise.all(promises);

    if (!src) {
      throw new BadRequestException('error.media');
    }

    const media = await this.mediaModel.create({
      authorId: user.id,
      type,
      extension,
      originalName: originalname,
      size,
      src,
      srcSmall,
      srcMedium,
    });

    return {
      id: media.id,
      author: {
        id: user.id,
      },
      type: media.type,
      extension,
      size,
      src,
      srcSmall,
      srcMedium,
      createdAt: media.createdAt,
    };
  }

  async deleteFile(id: number, user: User) {
    const media = await this.mediaModel.findOne({
      where: { id, authorId: user.id },
    });

    if (!media) {
      throw new BadRequestException('error.notFound.media');
    }

    const promises = [this.s3.deleteS3(media.src)];

    if (media.srcSmall) {
      promises.push(this.s3.deleteS3(media.srcSmall));
    }

    if (media.srcMedium) {
      promises.push(this.s3.deleteS3(media.srcMedium));
    }

    promises.push(media.destroy());

    await Promise.all(promises);
  }
}
