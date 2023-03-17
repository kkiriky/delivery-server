import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProducts } from './dtos/get-products.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 목록' })
  @ApiOkPaginatedResponse(GetProducts)
  @ApiHeaderBearer()
  @Get()
  getProducts(
    @Query() paginationQueries: PaginationQueries,
  ): Promise<PaginatedResponse<GetProducts>> {
    return this.productService.getProducts(paginationQueries);
  }
}
