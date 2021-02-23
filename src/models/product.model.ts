import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { ProductTranslation } from './productTranslation.model';

@Scopes(() => ({
  translate: (lang = 'en') => ({
    include: [
      {
        model: ProductTranslation,
        as: 'productTranslation',
        where: {
          lang,
        },
      },
    ],
  }),
}))
@Table
export class Product extends Model {
  @Column
  code: string;

  @HasMany(() => ProductTranslation)
  productTranslation: ProductTranslation[];

  toJSON() {
    const product: any = super.toJSON();

    if (!product.productTranslation) return product;

    const translation: any = this.productTranslation[0]?.toJSON();

    delete product.productTranslation;
    delete translation.lang;
    delete translation.productId;

    return { ...product, ...translation };
  }
}
