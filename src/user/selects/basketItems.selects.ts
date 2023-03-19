import { FindOptionsSelect } from 'typeorm';
import { BasketItem } from '../entities/basket-item.entity';

export const basketItemsSelects: FindOptionsSelect<BasketItem> = {
  id: true,
  count: true,
  product: {
    id: true,
    name: true,
    imgUrl: true,
    detail: true,
    price: true,
    restaurant: {
      id: true,
      deliveryFee: true,
    },
  },
};
