import { StringColumn } from '@/common/decorators/entity-property.decorator';
import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/orders/entities/order.entity';
import { Review } from '@/reviews/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @Column({ unique: true, length: 50 })
  email: string;

  @StringColumn({
    columnOptions: { select: false },
    apiPropertyOptions: { example: '123' },
  })
  password: string;

  @ApiProperty({ example: '/images/logo/kkiri.png' })
  @IsString()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ type: () => [Review] })
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @ApiProperty({ type: () => [Order] })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
