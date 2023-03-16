import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
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
      ...(lastData && { where: { createdAt: LessThan(lastData.createdAt) } }),
      select: restaurantsSelects,
      order: { createdAt: 'DESC' },
      take: limit,
    });

    const nextCount =
      data.length === 0
        ? 0
        : await this.restaurantRepository.count({
            where: { createdAt: LessThan(data[data.length - 1].createdAt) },
          });

    return {
      meta: { count: data.length, hasMore: nextCount !== 0 },
      data,
    };
  }
}
