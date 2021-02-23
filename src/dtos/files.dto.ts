import { ApiProperty } from '@nestjs/swagger';

export class PhotoUploadReqDto {
  @ApiProperty({
    type: 'file',
    isArray: true,
  })
  photos: any;
}
