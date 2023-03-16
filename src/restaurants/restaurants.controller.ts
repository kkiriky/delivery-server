import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import { PaginationQueries } from '@/common/dtos/pagination.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRestaurants } from './dtos/get-restaurants.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @ApiOperation({ summary: '가게 목록 가져오기' })
  @ApiOkPaginatedResponse(GetRestaurants)
  @ApiHeaderBearer()
  @UseGuards(AuthGuard)
  @Get()
  getRestaurants(@Query() paginationQueries: PaginationQueries) {
    return this.restaurantService.getRestaurants(paginationQueries);
  }
}
