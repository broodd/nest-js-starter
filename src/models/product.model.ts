import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { col, fn } from 'sequelize';
import { ProductI18n } from './productI18n.model';

@Scopes(() => ({
  i18n: languages => ({
    include: [
      {
        model: ProductI18n,
        as: 'i18n',
        where: {
          lang: languages,
        },
        attributes: {
          exclude: ['id', 'productId', 'lang', 'createdAt', 'updatedAt'],
        },
        limit: 1,
        order: [fn('array_position', languages, col('lang'))],
      },
    ],
  }),
}))
@Table
export class Product extends Model {
  @Column
  code: string;

  @HasMany(() => ProductI18n)
  i18n: ProductI18n[];

  toJSON() {
    const product: any = super.toJSON();

    if (product.i18n.length !== 1) {
      delete product.i18n;
      return product;
    }

    const i18n: any = product.i18n[0];
    delete product.i18n;

    return { ...product, ...i18n };
  }
}
