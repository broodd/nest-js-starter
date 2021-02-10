import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationReqDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'min: 0',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  offset = 0;

  @ApiPropertyOptional({
    type: Number,
    description: 'min: 1, max: 50',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  @IsNotEmpty()
  limit = 20;
}
