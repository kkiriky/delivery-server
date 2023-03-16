import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, ColumnOptions } from 'typeorm';

interface CustomColumnOptions {
  apiPropertyOptions?: ApiPropertyOptions;
  columnOptions?: ColumnOptions;
}

export const StringColumn = (options?: CustomColumnOptions) =>
  applyDecorators(
    options?.apiPropertyOptions
      ? ApiProperty({ ...options.apiPropertyOptions })
      : ApiProperty(),
    IsNotEmpty(),
    IsString(),
    options?.columnOptions ? Column({ ...options.columnOptions }) : Column(),
  );

export const IntColumn = (apiPropertyOptions?: ApiPropertyOptions) =>
  applyDecorators(ApiProperty(apiPropertyOptions), IsInt(), Column());
