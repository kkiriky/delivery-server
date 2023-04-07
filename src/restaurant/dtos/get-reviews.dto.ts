import { User } from '@/user/entities/user.entity';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ReviewImage } from '../entities/review-image.entity';
import { Review } from '../entities/review.entity';

class ReviewUser extends PickType(User, [
  'id',
  'email',
  'nickname',
  'imageUrl',
]) {}
class RestaurantReviewImage extends PickType(ReviewImage, ['id', 'imgUrl']) {}

export class GetReviews extends OmitType(Review, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'restaurant',
  'restaurantId',
  'user',
  'userId',
  'images',
]) {
  @ApiProperty()
  user: ReviewUser;

  @ApiProperty({ type: [RestaurantReviewImage] })
  images: RestaurantReviewImage[];
}
