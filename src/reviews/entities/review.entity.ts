import { BaseEntity } from '@/common/entities/base.entity';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { User } from '@/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ReviewImage } from './review-image.entity';

@Entity()
export class Review extends BaseEntity {
  @ApiProperty()
  @IsInt()
  @Column({ type: 'text' })
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ type: () => Restaurant })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reviews)
  restaurant: Restaurant;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  restaurantId: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  userId: string;

  @ApiProperty({ type: () => [ReviewImage] })
  @OneToMany(() => ReviewImage, (image) => image.review)
  images: ReviewImage[];
}
