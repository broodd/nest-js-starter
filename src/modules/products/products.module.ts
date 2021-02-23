import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../../models/product.model';
import { ProductTranslation } from '../../models/productTranslation.model';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [SequelizeModule.forFeature([Product, ProductTranslation])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
