import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Column, ColumnOptions } from 'typeorm';

interface CustomColumnOptions {
  apiPropertyOptions?: ApiPropertyOptions;
  columnOptions?: ColumnOptions;
}

const createApiProperty = (
  apiPropertyOptions: ApiPropertyOptions | undefined,
) => {
  return apiPropertyOptions
    ? ApiProperty({ ...apiPropertyOptions })
    : ApiProperty();
};

const createColumn = (columnOptions: ColumnOptions | undefined) => {
  return columnOptions ? Column({ ...columnOptions }) : Column();
};

export const StringColumn = (options?: CustomColumnOptions) =>
  applyDecorators(
    createApiProperty(options?.apiPropertyOptions),
    IsNotEmpty(),
    IsString(),
    createColumn(options?.columnOptions),
  );

export const IntColumn = (options?: CustomColumnOptions) =>
  applyDecorators(
    createApiProperty(options?.apiPropertyOptions),
    IsInt(),
    createColumn(options?.columnOptions),
  );
