import { FindOptionsSelect } from 'typeorm';
import { Product } from '../entities/product.entity';

export const restaurantProductsSelects: FindOptionsSelect<Product> = {
  id: true,
  name: true,
  imgUrl: true,
  detail: true,
  price: true,
};

export const productsSelects: FindOptionsSelect<Product> = {
  ...restaurantProductsSelects,
  restaurantId: true,
  createdAt: true,
};
