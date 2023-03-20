import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { uuidExample } from '../constants/common.constants';

export class PaginationQueries {
  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsInt()
  count?: number;

  @ApiProperty({ example: uuidExample, required: false })
  @IsOptional()
  @IsString()
  lastId?: string;
}

export class PaginatedResponse<TData> {
  meta: PaginationMeta;
  data: TData[];
}

export class PaginationMeta {
  @ApiProperty({ example: 20 })
  count: number;

  @ApiProperty({ example: true })
  hasMore: boolean;
}
