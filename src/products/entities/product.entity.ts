import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @StringColumn()
  name: string;

  @StringColumn()
  imgUrl: string;

  @StringColumn({ columnOptions: { type: 'text' } })
  detail: string;

  @IntColumn()
  price: number;

  @ApiProperty({ type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant;
  @StringColumn()
  restaurantId: string;
}
