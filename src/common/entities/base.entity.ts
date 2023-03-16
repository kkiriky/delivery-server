import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({ example: 'd3c37efa-3146-40a8-a0ec-623e2c398316' })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @IsDate()
  @DeleteDateColumn()
  deletedAt: Date;
}
