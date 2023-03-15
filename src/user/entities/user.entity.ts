import { BaseEntity } from '@/common/entities/base.entity';
import { Order } from '@/order/entities/order.entity';
import { Review } from '@/review/entities/review.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true, length: 50 })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ select: false })
  password: string;

  @ApiProperty()
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
