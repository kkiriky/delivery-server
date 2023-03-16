import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { uuidExample } from '../constants/common.constants';

export class IdParam {
  @ApiProperty({ example: uuidExample })
  @IsNotEmpty()
  @IsString()
  id: string;
}
