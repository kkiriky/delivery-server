import { Product } from '@/product/entities/product.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class GetRestaurantDetail extends OmitType(Restaurant, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'products',
]) {
  @ApiProperty({ type: () => [RestaurantProduct] })
  products: RestaurantProduct[];
}

class RestaurantProduct extends OmitType(Product, [
  'restaurantId',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
