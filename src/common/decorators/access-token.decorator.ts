import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const accessToken = req.headers.authorization?.split(' ')[1];
    return accessToken;
  },
);
