import { OmitType } from '@nestjs/swagger';
import { Restaurant } from '../entities/restaurant.entity';

export class GetRestaurants extends OmitType(Restaurant, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'detail',
  'products',
]) {}
