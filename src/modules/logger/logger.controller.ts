import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerReqDto } from './dto/logger.dto';
import { LoggerService } from './logger.service';

@Controller('logs')
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @Get('/json')
  getLogs(@Query() loggerReqDto: LoggerReqDto) {
    return this.loggerService.getLogs(loggerReqDto);
  }

  @Get('/json/:id')
  getLog(@Param('id') id: number) {
    return this.loggerService.getLog(id);
  }

  @Get('/:id')
  getLogPretty(@Param('id') id: number, @Res() res: Response) {
    return this.loggerService.getLogPretty(id, res);
  }
}
