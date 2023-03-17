import { uuidExample } from '@/common/constants/common.constants';
import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Review } from './review.entity';
import { StringColumn } from '@/common/decorators/entity-property.decorator';

@Entity()
export class ReviewImage extends BaseEntity {
  @StringColumn({ apiPropertyOptions: { example: 'images/reviews/0.jpg' } })
  imgUrl: string;

  @ManyToOne(() => Review, (review) => review.images)
  review: Review;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  reviewId: string;
}
