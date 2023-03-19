import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProducts } from './dtos/get-products.dto';
import { ProductService } from './product.service';

@ApiTags('Product')
@ApiHeaderBearer()
@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 목록' })
  @ApiOkPaginatedResponse(GetProducts)
  @Get()
  getProducts(
    @Query() paginationQueries: PaginationQueries,
  ): Promise<PaginatedResponse<GetProducts>> {
    return this.productService.getProducts(paginationQueries);
  }
}
