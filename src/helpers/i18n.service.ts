import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ScopeOptions } from 'sequelize';

@Injectable()
export class I18nService {
  constructor(private config: ConfigService) {}

  getI18nOptions(lang: string): ScopeOptions {
    const langs = [lang];

    const fallbackLang = this.config.get('i18n.fallbackLang');

    if (lang !== fallbackLang) {
      langs.push(fallbackLang);
    }

    return {
      method: ['i18n', langs],
    };
  }
}
