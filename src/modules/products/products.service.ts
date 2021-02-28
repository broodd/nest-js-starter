import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { I18nService } from '../../helpers/i18n.service';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,

    private i18nService: I18nService,
  ) {}

  async getProducts({ offset, limit }: PaginationReqDto, lang: string) {
    return await this.productModel
      .scope(this.i18nService.getI18nOptions(lang))
      .findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });
  }
}
