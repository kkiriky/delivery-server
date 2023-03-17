import { uuidExample } from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @StringColumn({ apiPropertyOptions: { example: '떡볶이' } })
  name: string;

  @StringColumn({ apiPropertyOptions: { example: 'images/떡볶이/떡볶이.jpg' } })
  imgUrl: string;

  @StringColumn({
    columnOptions: { type: 'text' },
    apiPropertyOptions: {
      example:
        '전통 떡볶이의 정석! 원하는대로 맵기를 선택하고 추억의 떡볶이맛에 빠져보세요! 쫀득한 쌀떡과 말랑한 오뎅의 완벽한 조화! 잘익은 반숙 계란은 덤!',
    },
  })
  detail: string;

  @IntColumn({ example: 10000 })
  price: number;

  @ApiProperty({ type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products)
  restaurant: Restaurant;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  restaurantId: string;
}
