import { Request } from 'express';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { PaginationQueries } from '../dtos/pagination.dto';
import { BaseEntity } from '../entities/base.entity';

export interface ExtendedRequest extends Request {
  userId: string;
}

export interface IPaginationQueries {
  count?: number;
  lastId?: string;
}

export class paginateParams<T extends BaseEntity> extends PaginationQueries {
  repository: Repository<T>;
  select: FindOptionsSelect<T>;
  addWhere?: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
}
