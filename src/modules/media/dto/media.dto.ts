import { ApiProperty } from '@nestjs/swagger';

export class MediaCreateReqDto {
  @ApiProperty({
    type: 'file',
  })
  file: any;
}
