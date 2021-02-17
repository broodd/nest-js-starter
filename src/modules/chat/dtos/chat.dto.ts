import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatReqDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  userIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
