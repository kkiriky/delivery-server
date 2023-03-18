import { IPaginationQueries } from '@/common/types/common.types';

export interface GetOrdersParams extends IPaginationQueries {
  userId: string;
}
