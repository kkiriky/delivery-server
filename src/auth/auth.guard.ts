import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { isJwtError, isJwtPayload } from './types/jwt.types';
import { CustomRequest } from '@/common/types/common.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: CustomRequest = context.switchToHttp().getRequest();

    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    try {
      const payload = jwt.verify(
        accessToken,
        this.configService.get('ACCESS_TOKEN_SECRET')!,
      );
      if (!isJwtPayload(payload)) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      req.userId = payload.userId;

      return true;
    } catch (err) {
      if (isJwtError(err) && err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      throw err;
    }
  }
}
