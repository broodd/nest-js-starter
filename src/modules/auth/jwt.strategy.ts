import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../../models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('accessToken.secret'),
    });
  }

  async validate({ id }: JwtPayload): Promise<User> {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new HttpException(
        {
          statusCode: 401,
          errors: ['error.auth.unathorized'],
        },
        401,
      );
    }

    return user;
  }
}
