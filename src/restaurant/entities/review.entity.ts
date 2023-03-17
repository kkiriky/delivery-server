import { uuidExample } from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { User } from '@/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReviewImage } from './review-image.entity';

@Entity()
export class Review extends BaseEntity {
  @IntColumn({ columnOptions: { type: 'text' } })
  rating: number;

  @StringColumn({ columnOptions: { type: 'text' } })
  content: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant;

  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  restaurantId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  userId: string;

  @OneToMany(() => ReviewImage, (image) => image.review)
  images: ReviewImage[];
}
