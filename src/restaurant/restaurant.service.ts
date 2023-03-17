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

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
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

  async getRestaurantDetail(rid: string): Promise<GetRestaurantDetail> {
    const qb = this.restaurantRepository.createQueryBuilder('restaurant');

    const restaurantDetail = await qb
      .select([
        'restaurant.id',
        'restaurant.name',
        'restaurant.thumbUrl',
        'restaurant.tags',
        'restaurant.ratings',
        'restaurant.ratingsCount',
        'restaurant.deliveryTime',
        'restaurant.deliveryFee',
        'restaurant.detail',
      ])
      .leftJoin('restaurant.products', 'product')
      .addSelect([
        'product.id',
        'product.name',
        'product.imgUrl',
        'product.detail',
        'product.price',
      ])
      .where('restaurant.id = :rid', { rid })
      .getOne();

    if (!restaurantDetail) {
      throw new BadRequestException('상점이 존재하지 않습니다.');
    }

    return restaurantDetail;
  }
}
