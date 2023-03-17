import { countExample, uuidExample } from '@/common/constants/common.constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderProduct {
  @ApiProperty({ example: uuidExample })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ example: countExample })
  @IsInt()
  count: number;
}

export interface CreateOrderParams {
  products: CreateOrderProduct[];
  userId: string;
}
