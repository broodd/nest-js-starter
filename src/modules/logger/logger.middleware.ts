import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';
import { Log } from '../../models/log.model';
import { User } from '../../models/user.model';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Log)
    private logModel: typeof Log,
  ) {}

  async use(
    req: Request & { errors: string[]; user: User; serverError: Error },
    res: Response,
    next: () => void,
  ) {
    res.on('finish', async () => {
      const getBody = () => {
        try {
          if (req.get('content-type').includes('application/json')) {
            const length = +req.get('content-length');
            if (length && length < 1000) {
              const body = JSON.parse(JSON.stringify(req.body));
              if (body.password) body.password = '';
              if (body.newPassword) body.newPassword = '';
              if (body.confirmPassword) body.confirmPassword = '';
              const bodyJSON = JSON.stringify(body);
              return bodyJSON;
            }
          }
        } catch (e) {
          return null;
        }
      };

      const ipAddr = req.ip.startsWith('::ffff:') ? req.ip.slice(7) : req.ip;

      const method = req.method;

      const url = req.originalUrl || req.url;

      const userId = req.user ? req.user.id : null;

      const reqLength = req.get('content-length');

      const resLength = res.get('content-length');

      const resStatus = +res.statusCode;

      const resStatusMessage = res.statusMessage;

      const resTime = res.get('X-Response-Time');

      const _errors = +res.statusCode >= 400 ? req.errors : [];
      const errors = _errors && _errors.length ? _errors : null;

      const serverError = req.serverError;

      const reqType = req.get('content-type');

      const reqBody = getBody();

      const authToken =
        req.get('authorization') && req.get('authorization').split('Bearer ')[1]
          ? req.get('authorization').split('Bearer ')[1]
          : null;

      const log = {
        ipAddr,
        method,
        url,
        userId,
        reqLength,
        resLength,
        resStatus,
        resStatusMessage,
        resTime,
        reqType,
        reqBody,
        authToken,
        errors,
        serverError,
      };

      await this.logModel.create(log);
    });
    next();
  }
}
