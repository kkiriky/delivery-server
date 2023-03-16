import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from '../types/common.types';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req: CustomRequest = ctx.switchToHttp().getRequest();
    return req.userId;
  },
);
