import { BaseEntity } from '@/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BasketItem } from './basket-item.entity';
import { User } from './user.entity';

@Entity()
export class Basket extends BaseEntity {
  @ApiProperty({ type: () => User })
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column()
  userId: string;

  @ApiProperty({ type: () => [BasketItem] })
  @OneToMany(() => BasketItem, (basketItem) => basketItem.basket)
  basketItems: BasketItem[];
}
