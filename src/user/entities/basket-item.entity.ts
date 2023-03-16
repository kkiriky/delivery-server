import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/products/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Basket } from './basket.entity';

@Entity()
export class BasketItem extends BaseEntity {
  @ApiProperty()
  @IsInt()
  @Column()
  count: number;

  @ManyToOne(() => Basket, (basket) => basket.basketItems)
  basket: Basket;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  basketId: string;

  @ApiProperty({ type: () => Product })
  @ManyToOne(() => Product)
  product: Product;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  productId: string;
}
