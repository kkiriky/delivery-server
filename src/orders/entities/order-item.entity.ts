import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @ApiProperty()
  @IsInt()
  @Column()
  count: number;

  @ApiProperty({ type: () => Order })
  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  orderId: string;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product)
  product: Product;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  productId: string;
}
