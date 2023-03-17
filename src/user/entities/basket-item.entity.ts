import { uuidExample } from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/product/entities/product.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Basket } from './basket.entity';

@Entity()
export class BasketItem extends BaseEntity {
  @IntColumn({ apiPropertyOptions: { example: 5 } })
  count: number;

  @ManyToOne(() => Basket, (basket) => basket.basketItems)
  basket: Basket;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  basketId: string;

  @ManyToOne(() => Product)
  product: Product;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  productId: string;
}
