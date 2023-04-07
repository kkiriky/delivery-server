import { AccessToken } from '@/common/decorators/access-token.decorator';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { LoginBody, LoginResponse } from './dtos/login.dto';
import { RefreshResponse } from './dtos/refresh.dto';
import { SignUpBody } from './dtos/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({ description: 'ok ' })
  @Post('signup')
  signup(@Body() signupBody: SignUpBody) {
    return this.authService.signup(signupBody);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ type: LoginResponse })
  @Post('login')
  login(@Body() loginBody: LoginBody): Promise<LoginResponse> {
    return this.authService.login(loginBody);
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiHeaderBearer()
  @ApiOkResponse({ type: LoginResponse })
  @Get('kakao')
  kakaoLogin(@AccessToken() accessToken: string): Promise<LoginResponse> {
    return this.authService.kakaoLogin(accessToken);
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @ApiHeaderBearer()
  @ApiOkResponse({ type: LoginResponse })
  @Get('naver')
  naverLogin(@AccessToken() accessToken: string): Promise<LoginResponse> {
    return this.authService.naverLogin(accessToken);
  }

  @ApiOperation({ summary: '액세스 토큰 리프레시' })
  @ApiHeaderBearer()
  @ApiCreatedResponse({ type: RefreshResponse })
  @Post('token')
  refresh(@Request() req: RequestType): Promise<RefreshResponse> {
    return this.authService.refresh(req.headers.authorization);
  }
}
