import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationQueries {
  @ApiProperty({ example: 20, required: false })
  @IsOptional()
  @IsInt()
  count?: number;

  @ApiProperty({
    example: 'f45af886-991b-464d-a96a-7ef2e81af3fa',
    required: false,
  })
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
