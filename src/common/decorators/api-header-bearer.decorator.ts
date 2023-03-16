import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export const ApiHeaderBearer = () =>
  applyDecorators(
    ApiHeader({
      name: 'Authorization',
      required: true,
      description: 'Bearer',
    }),
  );
