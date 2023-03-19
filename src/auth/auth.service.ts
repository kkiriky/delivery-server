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
import { RefreshResponse } from './dtos/refresh.dto';
import { SignUpBody } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly configService: ConfigService,
  ) {}

  async signup({ email, password, passwordConfirm }: SignUpBody) {
    const isExist = await this.userRepository.findOne({
      where: { email },
      select: { id: true },
    });
    if (isExist) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      );
    }

    const hash = await bcrypt.hash(password, 12);

    await this.userRepository.save(
      this.userRepository.create({
        email,
        password: hash,
        imageUrl: 'images/default.png',
      }),
    );

    return 'ok';
  }

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

  async refresh(authorization: string | undefined): Promise<RefreshResponse> {
    const refreshToken = authorization?.split(' ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('토큰이 존재하지 않습니다.');
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        this.configService.get('REFRESH_TOKEN_SECRET')!,
      );
      if (!isJwtPayload(payload)) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      const accessToken = this.issueAccessToken(payload.userId);

      return { accessToken };
    } catch (err) {
      if (!isJwtError(err)) throw err;

      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      throw err;
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
