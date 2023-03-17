import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export const StringInput = (apiPropertyOptions: ApiPropertyOptions) =>
  applyDecorators(ApiProperty(apiPropertyOptions), IsNotEmpty(), IsString());
