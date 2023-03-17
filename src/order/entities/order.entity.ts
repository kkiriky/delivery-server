import { priceExample, uuidExample } from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { User } from '@/user/entities/user.entity';
import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order extends BaseEntity {
  @IntColumn({ apiPropertyOptions: { example: priceExample } })
  totalPrice: number;

  @OneToMany(() => User, (user) => user.orders)
  user: User;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  userId: string;

  @JoinTable({ name: 'order_restaurants' })
  @ManyToMany(() => Restaurant)
  restaurants: Restaurant[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
