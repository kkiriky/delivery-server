import { countExample, uuidExample } from '@/common/constants/common.constants';
import { StringInput } from '@/common/decorators/input-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateOrderProduct {
  @StringInput({ example: uuidExample })
  productId: string;

  @ApiProperty({ example: countExample })
  @IsInt()
  count: number;
}
