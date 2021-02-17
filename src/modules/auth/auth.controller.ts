import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  FirebaseTokenReqDto,
  RefreshTokenReqDto,
  SignOutReqDto,
  TokensDto,
} from './dto/tokens.dto';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { AuthService } from './auth.service';
import { GetUser } from '../../decorators/get-user.decorator';
import { User } from '../../models/user.model';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/firebase')
  @ApiOperation({
    summary: 'Auth using firebase',
    description: `<b>Example client side to get firebaseIdToken <i>https://74214.csb.app</i></b>`,
  })
  @ApiOkResponse({ type: TokensDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  signByFirebase(@Body() signDto: FirebaseTokenReqDto) {
    return this.authService.signByFirebase(signDto);
  }

  @ApiBearerAuth()
  @UseGuards(new JwtAuthGuard())
  @Post('/signout')
  @ApiOperation({
    summary: 'Log out',
    description: 'This delete refresh token from DB',
  })
  @ApiOkResponse({ type: TokensDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  signOut(@Body() signDto: SignOutReqDto, @GetUser() user: User) {
    return this.authService.signOut(signDto, user);
  }

  @Post('/refresh-tokens')
  @ApiOperation({ summary: 'Refresh accessToken & refreshToken' })
  @ApiOkResponse({ type: TokensDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  async refreshTokens(@Body() refreshDto: RefreshTokenReqDto) {
    return this.authService.refreshTokens(refreshDto);
  }
}
