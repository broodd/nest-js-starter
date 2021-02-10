import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user) {
    if (err) {
      throw new HttpException(
        {
          statusCode: err.status,
          errors: err.response.errors,
        },
        err.status,
      );
    }

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

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest(err, user) {
    return user;
  }
}
