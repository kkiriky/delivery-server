import { FindOptionsSelect } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';

export const restaurantsSelects: FindOptionsSelect<Restaurant> = {
  id: true,
  createdAt: true,
  name: true,
  thumbUrl: true,
  tags: true,
  ratings: true,
  ratingsCount: true,
  deliveryTime: true,
  deliveryFee: true,
};
