import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import { IdParam } from '@/common/dtos/id-param.dto';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRestaurantDetail } from './dtos/get-restaurant-detail.dto';
import { GetRestaurants } from './dtos/get-restaurants.dto';
import { GetReviews } from './dtos/get-reviews.dto';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@UseGuards(AuthGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: '상점 목록' })
  @ApiOkPaginatedResponse(GetRestaurants)
  @ApiHeaderBearer()
  @Get()
  getRestaurants(
    @Query() paginationQueries: PaginationQueries,
  ): Promise<PaginatedResponse<GetRestaurants>> {
    return this.restaurantService.getRestaurants(paginationQueries);
  }

  @ApiOperation({ summary: '상점 상세보기' })
  @ApiOkResponse({ type: GetRestaurantDetail })
  @ApiHeaderBearer()
  @Get(':id')
  getRestaurantDetail(@Param() { id }: IdParam) {
    return this.restaurantService.getRestaurantDetail(id);
  }

  @ApiOperation({ summary: '리뷰 목록' })
  @ApiOkPaginatedResponse(GetReviews)
  @ApiHeaderBearer()
  @Get(':id/review')
  getReviews(
    @Param() { id }: IdParam,
    @Query() { count, lastId }: PaginationQueries,
  ): Promise<PaginatedResponse<GetReviews>> {
    return this.restaurantService.getReviews({
      restaurantId: id,
      count,
      lastId,
    });
  }
}
