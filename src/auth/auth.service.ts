import { DataSource, Repository } from 'typeorm';
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
import { Basket } from '@/user/entities/basket.entity';
import axios from 'axios';
import {
  KakaoUserInfo,
  NaverLoginResponse,
  SocialLoginParams,
} from './types/social-login.types';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,

    private readonly configService: ConfigService,
  ) {}

  async signup({ email, nickname, password, passwordConfirm }: SignUpBody) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const _user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, nickname: true },
    });
    if (_user) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }
    const isExistNickname = await this.userRepository.findOne({
      where: { nickname },
      select: { id: true },
    });
    if (isExistNickname) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
      );
    }

    const hash = await bcrypt.hash(password, 12);

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      const user = await manager.save(
        manager.create(User, {
          email,
          nickname,
          password: hash,
          imageUrl: 'images/default.png',
        }),
      );

      await manager.save(
        manager.create(Basket, {
          id: user.id,
          userId: user.id,
        }),
      );

      await queryRunner.commitTransaction();

      return 'ok';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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

  async kakaoLogin(accessToken: string): Promise<LoginResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const { data } = await axios<KakaoUserInfo>({
      url: 'https://kapi.kakao.com/v2/user/me',
      method: 'POST',
      data: {
        property_keys: ['kakao_account.email', 'kakao_acount.profile.nickname'],
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const { email } = data.kakao_account;
    const { nickname } = data.kakao_account.profile;

    const tokens = await this.socialLogin({ email, nickname });

    return tokens;
  }

  async naverLogin(accessToken: string): Promise<LoginResponse> {
    const { data } = await axios<NaverLoginResponse>({
      url: 'https://openapi.naver.com/v1/nid/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'text/json;charset=utf-8',
      },
    });

    const { email, nickname } = data.response;

    const tokens = await this.socialLogin({ email, nickname });
    return tokens;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const client = new OAuth2Client(
      this.configService.get('GOOGLE_SERVICE_CLIENT_ID'),
    );

    const ticket = await client.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_SERVICE_CLIENT_ID'),
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.name) {
      throw new BadRequestException();
    }

    const { email, name: nickname } = payload;
    const tokens = await this.socialLogin({ email, nickname });
    return tokens;
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
      if (isJwtError(err) && err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료되었습니다.');
      }

      throw err;
    }
  }

  private async socialLogin({
    email,
    nickname,
  }: SocialLoginParams): Promise<LoginResponse> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      let user = await manager.findOne(User, { where: { email } });
      if (!user) {
        user = await manager.save(
          manager.create(User, {
            email,
            nickname,
            imageUrl: 'images/default.png',
          }),
        );
      }

      const accessToken = this.issueAccessToken(user.id);
      const refreshToken = this.issueRefreshToken(user.id);

      await queryRunner.commitTransaction();

      return { accessToken, refreshToken };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private issueAccessToken(userId: string) {
    return jwt.sign(
      { userId, type: 'access' },
      this.configService.get('ACCESS_TOKEN_SECRET')!,
      { expiresIn: '600s' },
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
