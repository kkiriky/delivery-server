import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { User } from '@/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order extends BaseEntity {
  @ApiProperty()
  @IsInt()
  @Column()
  totalPrice: number;

  @ApiProperty({ type: () => User })
  @OneToMany(() => User, (user) => user.orders)
  user: User;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  userId: string;

  @ApiProperty({ type: () => [Restaurant] })
  @JoinTable({ name: 'order_restaurants' })
  @ManyToMany(() => Restaurant)
  restaurants: Restaurant[];

  @ApiProperty({ type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];
}
