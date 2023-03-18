import { CommonService } from '../common/common.service';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRestaurantDetail } from './dtos/get-restaurant-detail.dto';
import { GetRestaurants } from './dtos/get-restaurants.dto';
import { Restaurant } from './entities/restaurant.entity';
import { restaurantsSelects } from './selects/restaurants.selects';
import { Review } from './entities/review.entity';
import { reviewsSelects } from './selects/reviews.selects';
import { GetReviews } from './dtos/get-reviews.dto';
import { restaurantProductsSelects } from '@/product/selects/products.select';
import { GetReviewsParams } from './types/restaurant.types';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly commonService: CommonService,
  ) {}

  async getRestaurants({
    count,
    lastId,
  }: PaginationQueries): Promise<PaginatedResponse<GetRestaurants>> {
    return this.commonService.pagintate({
      count,
      lastId,
      repository: this.restaurantRepository,
      select: restaurantsSelects,
    });
  }

  async getRestaurantDetail(id: string): Promise<GetRestaurantDetail> {
    const restaurantDetail = await this.restaurantRepository.findOne({
      where: { id },
      select: {
        ...restaurantsSelects,
        createdAt: false,
        detail: true,
        products: restaurantProductsSelects,
      },
      relations: {
        products: true,
      },
    });

    if (!restaurantDetail) {
      throw new BadRequestException('상점이 존재하지 않습니다.');
    }

    return restaurantDetail;
  }

  async getReviews({
    count,
    lastId,
    restaurantId,
  }: GetReviewsParams): Promise<PaginatedResponse<GetReviews>> {
    return this.commonService.pagintate({
      count,
      lastId,
      repository: this.reviewRepository,
      select: reviewsSelects,
      addWhere: { restaurantId },
      relations: {
        user: true,
        images: true,
      },
    });
  }
}
