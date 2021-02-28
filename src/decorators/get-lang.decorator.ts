import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as languageParser from 'accept-language-parser';

export const GetLang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const languageHeader = request.headers['accept-language'];

    const languages = languageParser.parse(languageHeader);
    const primaryLanguage = languages[0];

    return primaryLanguage?.code.toLowerCase();
  },
);
