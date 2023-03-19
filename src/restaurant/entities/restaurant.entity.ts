import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/order/entities/order.entity';
import { Product } from '@/product/entities/product.entity';
import { Review } from '@/restaurant/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Restaurant extends BaseEntity {
  @StringColumn({ apiPropertyOptions: { example: '불타는 떡볶이' } })
  name: string;

  @StringColumn({
    apiPropertyOptions: { example: '/images/떡볶이/떡볶이.jpg' },
  })
  thumbUrl: string;

  @ApiProperty({ example: ['떡볶이', '치즈', '매운맛'] })
  @IsArray()
  @Column({ type: 'json' })
  tags: string[];

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Column({ type: 'double' })
  ratings: number;

  @IntColumn({ apiPropertyOptions: { example: 200 } })
  ratingsCount: number;

  @IntColumn({ apiPropertyOptions: { example: 20 } })
  deliveryTime: number;

  @IntColumn({ apiPropertyOptions: { example: 2500 } })
  deliveryFee: number;

  @StringColumn({
    columnOptions: { type: 'text' },
    apiPropertyOptions: {
      example:
        '!!!리뷰 EVENT & 비조리 EVENT 진행중!!! @ 기본적으로 매콤합니다 @@ 덜맵게 가능하니 요청사항에 적어주세요 @@ 1인분 배달 가능합니다 @',
    },
  })
  detail: string;

  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @JoinTable({ name: 'restaurant_order' })
  @ManyToMany(() => Order, (order) => order.restaurants)
  orders: Order[];
}
