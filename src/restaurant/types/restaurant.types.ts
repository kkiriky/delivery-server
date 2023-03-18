import { IPaginationQueries } from '@/common/types/common.types';

export interface GetReviewsParams extends IPaginationQueries {
  restaurantId: string;
}
