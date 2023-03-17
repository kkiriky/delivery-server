import {
  priceExample,
  productDetailExample,
  uuidExample,
} from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @StringColumn({ apiPropertyOptions: { example: '떡볶이' } })
  name: string;

  @StringColumn({ apiPropertyOptions: { example: 'images/떡볶이/떡볶이.jpg' } })
  imgUrl: string;

  @StringColumn({
    columnOptions: { type: 'text' },
    apiPropertyOptions: { example: productDetailExample },
  })
  detail: string;

  @IntColumn({ apiPropertyOptions: { example: priceExample } })
  price: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  restaurantId: string;
}
