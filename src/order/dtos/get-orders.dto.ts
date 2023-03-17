import { IPaginationQueries } from '@/common/dtos/pagination.dto';
import { Product } from '@/product/entities/product.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

export interface GetOrdersParams extends IPaginationQueries {
  userId: string;
}

class OrderItemProduct extends PickType(Product, ['id', 'name', 'imgUrl']) {}

class OrderItemDto extends PickType(OrderItem, ['id', 'count']) {
  @ApiProperty({ type: OrderItemProduct })
  product: OrderItemProduct;
}

export class OrderDto extends PickType(Order, [
  'id',
  'createdAt',
  'totalPrice',
  'totalCount',
]) {
  @ApiProperty({ type: [OrderItemDto] })
  orderItems: OrderItemDto[];
}
