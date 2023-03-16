import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { uuidExample } from '../constants/common.constants';

export class BaseEntity {
  @ApiProperty({ example: uuidExample })
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
