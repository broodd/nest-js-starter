import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { PaginationReqDto } from '../../../dtos/pagination.dto';

export class LoggerReqDto extends PaginationReqDto {
  @Max(5000)
  limit = 100;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  ipAddr: string;

  @IsOptional()
  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  resStatus: number;

  @IsOptional()
  @IsString()
  reqType: string;
}
