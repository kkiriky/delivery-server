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
  async pagintate<TData extends BaseEntity>({
    count,
    lastId,
    repository,
    select,
    addWhere,
    relations,
  }: paginateParams<TData>): Promise<PaginatedResponse<TData>> {
    const limit = count ?? 20;

    let lastData: TData | null = null;
    if (lastId) {
      lastData = await repository.findOne({
        where: { id: lastId } as FindOptionsWhere<TData>,
        select: { createdAt: true } as FindOptionsSelect<TData>,
      });
      if (!lastData) {
        throw new BadRequestException('잘못된 요청입니다.');
      }
    }

    const data = await repository.find({
      where: lastData
        ? ({
            ...addWhere,
            createdAt: LessThan(lastData.createdAt),
          } as FindOptionsWhere<TData>)
        : addWhere,
      select,
      ...(relations && { relations }),
      order: { createdAt: 'DESC' } as FindOptionsOrder<TData>,
      take: limit,
    });

    const nextCount =
      data.length === 0
        ? 0
        : await repository.count({
            where: {
              ...addWhere,
              createdAt: LessThan(data[data.length - 1].createdAt),
            } as FindOptionsWhere<TData>,
          });

    return {
      meta: { count: data.length, hasMore: nextCount !== 0 },
      data,
    };
  }
}
