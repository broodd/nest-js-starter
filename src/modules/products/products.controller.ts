import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { ErrorDto } from '../../dtos/simple-response.dto';
import { ProductsService } from './products.service';
import { PaginationReqDto } from '../../dtos/pagination.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get products' })
  @ApiBadRequestResponse({ type: ErrorDto })
  getChats(@Query() getDto: PaginationReqDto) {
    return this.productsService.getUsers(getDto);
  }
}
