import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../types/common.types';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req: ExtendedRequest = ctx.switchToHttp().getRequest();
    return req.userId;
  },
);
