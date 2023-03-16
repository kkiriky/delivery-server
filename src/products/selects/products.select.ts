import { FindOptionsSelect } from 'typeorm';
import { Product } from '../entities/product.entity';

export const productsSelects: FindOptionsSelect<Product> = {
  id: true,
  name: true,
  imgUrl: true,
  detail: true,
  price: true,
  restaurantId: true,
  createdAt: true,
};
