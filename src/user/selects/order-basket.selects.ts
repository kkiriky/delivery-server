import { FindOptionsSelect } from 'typeorm';
import { BasketItem } from '../entities/basket-item.entity';

export const orderBasketItemSelects: FindOptionsSelect<BasketItem> = {
  id: true,
  count: true,
  productId: true,
  product: {
    id: true,
    price: true,
    restaurant: {
      id: true,
      deliveryFee: true,
    },
  },
};
