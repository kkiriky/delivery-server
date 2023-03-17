import { IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Review } from './review.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ReviewImage extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  imgUrl: string;

  @ApiProperty({ type: () => Review })
  @ManyToOne(() => Review, (review) => review.images)
  review: Review;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  reviewId: string;
}
