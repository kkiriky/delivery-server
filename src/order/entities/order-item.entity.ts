import { countExample, uuidExample } from '@/common/constants/common.constants';
import {
  IntColumn,
  StringColumn,
} from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Product } from '@/product/entities/product.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @IntColumn({ apiPropertyOptions: { example: countExample } })
  count: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  orderId: string;

  @ManyToOne(() => Product)
  product: Product;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  productId: string;
}
