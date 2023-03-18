import { uuidExample } from '@/common/constants/common.constants';
import { StringInput } from '@/common/decorators/input-property.decorator';
import { Product } from '@/product/entities/product.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantIdParam {
  @StringInput({ example: uuidExample })
  restaurantId: string;
}

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
