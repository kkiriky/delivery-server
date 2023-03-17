import { FindOptionsSelect } from 'typeorm';
import { Review } from '../entities/review.entity';

export const reviewsSelects: FindOptionsSelect<Review> = {
  id: true,
  rating: true,
  content: true,
  createdAt: true,
  user: {
    id: true,
    email: true,
    imageUrl: true,
  },
  images: {
    id: true,
    imgUrl: true,
  },
};
