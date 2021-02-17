import { Controller, UseGuards, Get, Query, Body, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../models/user.model';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { ChatService } from './chat.service';
import { Post } from '@nestjs/common';
import { CreateChatReqDto } from './dtos/chat.dto';

@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get own chats' })
  @ApiBadRequestResponse({ type: ErrorDto })
  getChats(@Query() getDto: PaginationReqDto, @GetUser() user: User) {
    return this.chatService.getChats(getDto, user);
  }

  @Get('/:id/messages')
  @ApiOperation({ summary: 'Get chat messages' })
  @ApiBadRequestResponse({ type: ErrorDto })
  getChatMessages(
    @Param('id') id: number,
    @Query() getDto: PaginationReqDto,
    @GetUser() user: User,
  ) {
    return this.chatService.getMessages(id, getDto, user);
  }

  @Get('/:id/partipants')
  @ApiOperation({ summary: 'Get chat partipans' })
  @ApiBadRequestResponse({ type: ErrorDto })
  getPartipants(
    @Param('id') id: number,
    @Query() getDto: PaginationReqDto,
    @GetUser() user: User,
  ) {
    return this.chatService.getPartipants(id, getDto, user);
  }

  @Post('/')
  @ApiOperation({ summary: 'Create chat' })
  @ApiBadRequestResponse({ type: ErrorDto })
  createChat(@Body() createDto: CreateChatReqDto, @GetUser() user: User) {
    return this.chatService.createChat(createDto, user);
  }
}
