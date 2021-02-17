import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { UsersService } from './users.service';
import { GetUser } from '../../decorators/get-user.decorator';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { User } from '../../models/user.model';

@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get users' })
  // @ApiOkResponse({ type: TokensDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  getChats(@Query() getDto: PaginationReqDto, @GetUser() user: User) {
    return this.usersService.getUsers(getDto, user);
  }
}
