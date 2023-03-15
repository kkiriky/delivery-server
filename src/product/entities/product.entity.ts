import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  imgUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  detail: string;

  @ApiProperty()
  @IsInt()
  @Column()
  price: number;

  @ApiProperty({ type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  restaurantId: string;
}
