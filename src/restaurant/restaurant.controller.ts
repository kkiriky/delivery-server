import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetRestaurantDetail,
  RestaurantIdParam,
} from './dtos/get-restaurant-detail.dto';
import { GetRestaurants } from './dtos/get-restaurants.dto';
import { GetReviews } from './dtos/get-reviews.dto';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@ApiHeaderBearer()
@UseGuards(AuthGuard)
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: '상점 목록' })
  @ApiOkPaginatedResponse(GetRestaurants)
  @Get()
  getRestaurants(
    @Query() paginationQueries: PaginationQueries,
  ): Promise<PaginatedResponse<GetRestaurants>> {
    return this.restaurantService.getRestaurants(paginationQueries);
  }

  @ApiOperation({ summary: '상점 상세보기' })
  @ApiOkResponse({ type: GetRestaurantDetail })
  @Get(':restaurantId')
  getRestaurantDetail(@Param() { restaurantId }: RestaurantIdParam) {
    return this.restaurantService.getRestaurantDetail(restaurantId);
  }

  @ApiOperation({ summary: '리뷰 목록' })
  @ApiOkPaginatedResponse(GetReviews)
  @Get(':restaurantId/review')
  getReviews(
    @Param() { restaurantId }: RestaurantIdParam,
    @Query() { count, lastId }: PaginationQueries,
  ): Promise<PaginatedResponse<GetReviews>> {
    return this.restaurantService.getReviews({
      restaurantId,
      count,
      lastId,
    });
  }
}
