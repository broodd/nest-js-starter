import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { I18nHelper } from '../../helpers/i18n.service';
import { Product } from '../../models/product.model';
import { ProductI18n } from '../../models/productI18n.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductI18n])],
  controllers: [ProductsController],
  providers: [ProductsService, I18nHelper],
  exports: [ProductsService],
})
export class ProductsModule {}
