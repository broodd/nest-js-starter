import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseTokenDto, RefreshTokenDto } from './dto/credentials.dto';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { AuthResponse } from './dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/firebase')
  @ApiOperation({ summary: 'Auth firebase' })
  @ApiOkResponse({ type: AuthResponse })
  @ApiBadRequestResponse({ type: ErrorDto })
  signByFirebase(@Body() signDto: FirebaseTokenDto) {
    return this.authService.signByFirebase(signDto);
  }

  @Post('/refresh-tokens')
  async refreshTokens(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshDto);
  }
}
