import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FirebaseTokenDto } from './dto/credentials.dto';
import { AuthResponse } from './dto/response.dto';
import { verifyFirebaseIdToken } from '../../helpers/firebase';
import { RefreshToken } from '../../models/refreshToken.model';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(RefreshToken)
    private refreshModel: typeof RefreshToken,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private async clearRefreshTokens(userId: number) {
    const tokens = await this.refreshModel.findAll({
      where: { userId },
      order: [['expireAt', 'ASC']],
    });

    if (!tokens.length) return;

    const needDeleteCount =
      tokens.length - this.config.get('refreshToken.maxCount');

    if (needDeleteCount <= 0) return;

    const badRefreshTokens = tokens
      .slice(0, needDeleteCount + 1)
      .map(token => token.id);

    await this.refreshModel.destroy({
      where: {
        id: badRefreshTokens,
      },
    });
  }

  private async generateTokens(userId: number): Promise<AuthResponse> {
    const payload: JwtPayload = {
      id: userId,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuid();
    const expireAt = moment()
      .add(...this.config.get('refreshToken.expireIn'))
      .toDate();

    try {
      const refreshTokenHash: string = await bcrypt.hash(refreshToken, 10);

      await this.refreshModel.create({
        userId: userId,
        token: refreshTokenHash,
        expireAt,
      } as RefreshToken);
    } catch {
      throw new InternalServerErrorException('error.server');
    }

    return {
      accessToken,
      refreshToken,
      expireAt,
    };
  }

  async signByFirebase({
    firebaseIdToken,
  }: FirebaseTokenDto): Promise<AuthResponse> {
    const decoded = await verifyFirebaseIdToken(firebaseIdToken);
    const firebaseId = decoded.uid;

    let user = await this.userModel.findOne({
      where: {
        firebaseId,
      },
    });

    if (user) {
      await this.clearRefreshTokens(user.id);
    } else {
      user = await this.userModel.create({
        firebaseId,
      });
    }

    return this.generateTokens(user.id);
  }

  async refreshTokens({ userId, refreshToken }) {
    const refreshTokens = await this.refreshModel.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!refreshTokens.length) {
      throw new BadRequestException('error.notFound.auth.refreshToken');
    }

    let foundedToken: RefreshToken;

    for (const data of refreshTokens) {
      if (await bcrypt.compare(refreshToken, data.token)) {
        foundedToken = data;
        break;
      }
    }

    if (foundedToken === undefined) {
      throw new BadRequestException('error.notFound.auth.refreshToken');
    }

    await foundedToken.destroy();

    if (new Date() > new Date(foundedToken.expireAt)) {
      throw new BadRequestException('error.auth.refreshExpire');
    }

    return this.generateTokens(userId);
  }
}
