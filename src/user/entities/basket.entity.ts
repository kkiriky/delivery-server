import { uuidExample } from '@/common/constants/common.constants';
import { StringColumn } from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BasketItem } from './basket-item.entity';
import { User } from './user.entity';

@Entity()
export class Basket extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @StringColumn({ apiPropertyOptions: { example: uuidExample } })
  userId: string;

  @OneToMany(() => BasketItem, (basketItem) => basketItem.basket)
  basketItems: BasketItem[];
}
