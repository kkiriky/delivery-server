import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  LessThan,
} from 'typeorm';
import { PaginatedResponse } from './dtos/pagination.dto';
import { BaseEntity } from './entities/base.entity';
import { paginateParams } from './types/common.types';

@Injectable()
export class CommonService {
  async pagintate<T extends BaseEntity>({
    count,
    lastId,
    repository,
    select,
  }: paginateParams<T>): Promise<PaginatedResponse<T>> {
    const limit = count ?? 20;

    let lastData: T | null = null;
    if (lastId) {
      lastData = await repository.findOne({
        where: { id: lastId } as FindOptionsWhere<T>,
        select: { createdAt: true } as FindOptionsSelect<T>,
      });
      if (!lastData) {
        throw new BadRequestException('잘못된 요청입니다.');
      }
    }

    const data = await repository.find({
      ...(lastData && {
        where: {
          createdAt: LessThan(lastData.createdAt),
        } as FindOptionsWhere<T>,
      }),
      select,
      order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
      take: limit,
    });

    const nextCount =
      data.length === 0
        ? 0
        : await repository.count({
            where: {
              createdAt: LessThan(data[data.length - 1].createdAt),
            } as FindOptionsWhere<T>,
          });

    return {
      meta: { count: data.length, hasMore: nextCount !== 0 },
      data,
    };
  }
}
