import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @ApiProperty({ type: 'UUID' })
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
