import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity({ name: 'restaurant_order' })
export class RestaurantToOrder {
  @ManyToOne(() => Order)
  order: Order;
  @PrimaryColumn({ type: 'uuid', length: 36 })
  orderId: string;

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
  @PrimaryColumn({ type: 'uuid', length: 36 })
  restaurantId: string;
}
