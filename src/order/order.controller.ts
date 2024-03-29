import { OrderService } from './order.service';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { UserId } from '@/common/decorators/user-id.decorator';
import { AuthGuard } from '@/auth/auth.guard';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkPaginatedResponse } from '@/common/decorators/api-ok-paginated-response.decorator';
import { OrderDto } from './dtos/get-orders.dto';

@ApiTags('Order')
@ApiHeaderBearer()
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '주문 목록' })
  @ApiOkPaginatedResponse(OrderDto)
  @Get()
  getOrders(
    @Query() { count, lastId }: PaginationQueries,
    @UserId() userId: string,
  ): Promise<PaginatedResponse<OrderDto>> {
    return this.orderService.getOrders({ count, lastId, userId });
  }

  @ApiOperation({ summary: '주문 생성' })
  @ApiCreatedResponse({ type: OrderDto })
  @Post()
  createOrderFromBasket(@UserId() userId: string): Promise<OrderDto> {
    return this.orderService.createOrderFromBasket(userId);
  }
}
