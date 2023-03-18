import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiOkNullableResponseOptions {
  description?: string;
}

export const ApiOkNullableResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiOkNullableResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        nullable: true,
        oneOf: [
          { $ref: getSchemaPath(model) },
          { title: 'NULL', type: 'null' },
        ],
      },
      description: options?.description,
    }),
  );
};
