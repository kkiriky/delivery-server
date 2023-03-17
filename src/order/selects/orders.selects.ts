import { FindOptionsSelect } from 'typeorm';
import { Order } from '../entities/order.entity';

export const ordersSelects: FindOptionsSelect<Order> = {
  id: true,
  createdAt: true,
  totalPrice: true,
  totalCount: true,
  orderItems: {
    id: true,
    count: true,
    product: {
      id: true,
      name: true,
      imgUrl: true,
    },
  },
};
