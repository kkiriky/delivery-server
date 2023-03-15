/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBody, LoginResponse } from './dtos/login.dto';
import { User } from '@/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { isJwtError, isJwtPayload } from './types/jwt.types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async login({ email, password }: LoginBody): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user) {
      throw new BadRequestException('계정이 존재하지 않습니다.');
    }

    const isValidate = await bcrypt.compare(password, user.password);
    if (!isValidate) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const accessToken = this.issueAccessToken(user.id);
    const refreshToken = this.issueRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async refresh(authorization: string | undefined) {
    if (!authorization) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    const refreshToken = authorization.split(' ')[1];

    try {
      const payload = jwt.verify(
        refreshToken,
        this.configService.get('REFRESH_TOKEN_SECRET')!,
      );
      if (!isJwtPayload(payload)) {
        throw new BadRequestException('잘못된 요청입니다.');
      }

      const accessToken = this.issueAccessToken(payload.userId);

      return { accessToken };
    } catch (err) {
      if (!isJwtError(err)) throw err;

      if (err.name === 'JsonWebTokenError') {
        throw new BadRequestException('잘못된 요청입니다.');
      } else if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      } else {
        throw err;
      }
    }
  }

  private issueAccessToken(userId: string) {
    return jwt.sign(
      { userId, type: 'access' },
      this.configService.get('ACCESS_TOKEN_SECRET')!,
      { expiresIn: '300s' },
    );
  }

  private issueRefreshToken(userId: string) {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.configService.get('REFRESH_TOKEN_SECRET')!,
      { expiresIn: '1d' },
    );
  }
}
