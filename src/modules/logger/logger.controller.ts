import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Response } from 'express';
import { LoggerReqDto } from './dto/logger.dto';
import { LoggerService } from './logger.service';

@Controller('logs')
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @ApiExcludeEndpoint()
  @Get('/json')
  getLogs(@Query() loggerReqDto: LoggerReqDto) {
    return this.loggerService.getLogs(loggerReqDto);
  }

  @ApiExcludeEndpoint()
  @Get('/json/:id')
  getLog(@Param('id') id: number) {
    return this.loggerService.getLog(id);
  }

  @ApiExcludeEndpoint()
  @Get('/:id')
  getLogPretty(@Param('id') id: number, @Res() res: Response) {
    return this.loggerService.getLogPretty(id, res);
  }
}
