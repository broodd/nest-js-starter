import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FirebaseTokenReqDto {
  @ApiProperty()
  @IsNotEmpty()
  firebaseIdToken: string;
}

export class SignOutReqDto {
  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshTokenReqDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;
}

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  expireAt: Date;
}
