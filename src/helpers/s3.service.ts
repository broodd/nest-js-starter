import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  constructor(private config: ConfigService) {}

  private s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(this.config.get('s3.endpoint')),
  });

  async uploadS3(
    file: Buffer,
    name: string,
    mimetype: string,
  ): Promise<string | null> {
    return new Promise(resolve => {
      this.s3.upload(
        {
          Bucket: this.config.get('s3.bucketName'),
          Key: name,
          Body: file,
          ACL: 'public-read',
          ContentType: mimetype,
        },
        (err, data) => {
          if (err || !data) {
            resolve(null);
          }
          resolve(data.Location);
        },
      );
    });
  }

  async deleteS3(src: string) {
    return new Promise(resolve => {
      this.s3.deleteObject(
        {
          Bucket: this.config.get('s3.bucket_name'),
          Key: src.split(this.config.get('s3.endpoint'))[1].slice(1),
        },
        function() {
          resolve(null);
        },
      );
    });
  }

  async resizeImage(
    buff: Buffer,
    w: number,
    h: number,
    fit: string,
  ): Promise<Buffer> {
    return new Promise(resolve => {
      sharp(buff)
        .ensureAlpha()
        .resize(w, h, { fit })
        .toBuffer((err, buffer) => {
          if (err) return resolve(null);
          resolve(buffer);
        });
    });
  }
}
