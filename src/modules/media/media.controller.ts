import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { GetUser } from '../../decorators/get-user.decorator';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { User } from '../../models/user.model';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { MediaCreateReqDto } from './dto/media.dto';

@ApiTags('media')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Upload file',
  })
  @ApiBadRequestResponse({ type: ErrorDto })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MediaCreateReqDto })
  uploadFile(@UploadedFile() file, @GetUser() user: User) {
    return this.mediaService.uploadFile(file, user);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete file',
  })
  @ApiBadRequestResponse({ type: ErrorDto })
  deleteFile(@Param('id') id: number, @GetUser() user: User) {
    return this.mediaService.deleteFile(id, user);
  }
}
