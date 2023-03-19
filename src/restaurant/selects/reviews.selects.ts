import { userSelects } from '@/user/selects/user.selects';
import { FindOptionsSelect } from 'typeorm';
import { Review } from '../entities/review.entity';

export const reviewsSelects: FindOptionsSelect<Review> = {
  id: true,
  rating: true,
  content: true,
  createdAt: true,
  user: userSelects,
  images: {
    id: true,
    imgUrl: true,
  },
};
