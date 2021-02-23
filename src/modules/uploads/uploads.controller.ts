import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PhotoUploadReqDto } from '../../dtos/files.dto';
import { UploadsService } from './uploads.service';
import { GetUser } from '../../decorators/get-user.decorator';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { User } from '../../models/user.model';
import { ErrorDto, MessageDto } from '../../dtos/simple-response.dto';

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(new JwtAuthGuard())
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Upload photos',
    description: 'Formats: jpg, jpeg, png, gif.<br>Max photo size: 10Mb.<br>',
  })
  @ApiBadRequestResponse({ type: ErrorDto })
  @UseInterceptors(FilesInterceptor('photos'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUploadReqDto })
  uploadFile(@UploadedFiles() files, @GetUser() user: User) {
    return this.uploadsService.uploadFile(files, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove file' })
  @ApiOkResponse({ type: MessageDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  deletePhoto(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.uploadsService.deleteFile(id, user);
  }
}
