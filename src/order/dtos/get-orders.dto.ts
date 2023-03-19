import { Product } from '@/product/entities/product.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

class OrderItemProductRestaurant extends PickType(Restaurant, [
  'id',
  'name',
  'thumbUrl',
]) {}

class OrderItemProduct extends PickType(Product, ['id', 'name', 'imgUrl']) {
  @ApiProperty({ type: OrderItemProductRestaurant })
  restaurant: OrderItemProductRestaurant;
}

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
