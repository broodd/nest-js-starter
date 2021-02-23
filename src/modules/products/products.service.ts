import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationReqDto } from '../../dtos/pagination.dto';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async getProducts({ offset, limit }: PaginationReqDto) {
    return await this.productModel
      .scope({ method: ['translate', 'en'] })
      .findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });
  }
}
