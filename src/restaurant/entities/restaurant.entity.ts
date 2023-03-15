import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/order/entities/order.entity';
import { Product } from '@/product/entities/product.entity';
import { Review } from '@/review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Restaurant extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  thumbUrl: string;

  @ApiProperty()
  @IsArray()
  @Column({ type: 'json' })
  tags: string[];

  @ApiProperty()
  @IsNumber()
  @Column()
  ratings: number;

  @ApiProperty()
  @IsInt()
  @Column()
  ratingsCount: number;

  @ApiProperty()
  @IsInt()
  @Column()
  deliveryTime: number;

  @ApiProperty()
  @IsInt()
  @Column()
  deliveryFee: number;

  @ApiProperty({ type: () => [Product] })
  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];

  @ApiProperty({ type: () => [Review] })
  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @ApiProperty({ type: () => [Order] })
  @ManyToMany(() => Order)
  orders: Order[];
}
