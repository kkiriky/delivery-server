import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { GetRestaurantDetail } from './dtos/get-restaurant-detail.dto';
import { GetRestaurants } from './dtos/get-restaurants.dto';
import { Restaurant } from './entities/restaurant.entity';
import { restaurantsSelects } from './selects/restaurants.selects';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async getRestaurants({
    count,
    lastId,
  }: PaginationQueries): Promise<PaginatedResponse<GetRestaurants>> {
    const limit = count ?? 20;

    let lastData: Restaurant | null = null;
    if (lastId) {
      lastData = await this.restaurantRepository.findOne({
        where: { id: lastId },
        select: { createdAt: true },
      });
      if (!lastData) {
        throw new BadRequestException('잘못된 요청입니다.');
      }
    }

    const data = await this.restaurantRepository.find({
      ...(lastData && { where: { createdAt: MoreThan(lastData.createdAt) } }),
      select: restaurantsSelects,
      order: { createdAt: 'ASC' },
      take: limit,
    });

    const nextCount =
      data.length === 0
        ? 0
        : await this.restaurantRepository.count({
            where: { createdAt: MoreThan(data[data.length - 1].createdAt) },
          });

    return {
      meta: { count: data.length, hasMore: nextCount !== 0 },
      data,
    };
  }

  async getRestaurantDetail(id: string): Promise<GetRestaurantDetail> {
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
      .where('restaurant.id = :id', { id })
      .getOne();

    if (!restaurantDetail) {
      throw new BadRequestException('상점이 존재하지 않습니다.');
    }

    return restaurantDetail;
  }
}
