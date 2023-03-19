import { FindOptionsRelations } from 'typeorm';
import { Order } from '../entities/order.entity';

export const orderRelations: FindOptionsRelations<Order> = {
  orderItems: {
    product: {
      restaurant: true,
    },
  },
};
