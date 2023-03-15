import { Body, Controller, Post, Request } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { AuthService } from './auth.service';
import { LoginBody, LoginResponse } from './dtos/login.dto';
import { RefreshResponse } from './dtos/refresh.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ type: LoginResponse })
  @Post('login')
  login(@Body() loginBody: LoginBody): Promise<LoginResponse> {
    return this.authService.login(loginBody);
  }

  @ApiOperation({ summary: '액세스 토큰 리프레시' })
  @ApiHeader({ name: 'Authorization', required: true, description: 'Bearer' })
  @ApiCreatedResponse({ type: RefreshResponse })
  @Post('token')
  refresh(@Request() req: RequestType): Promise<RefreshResponse> {
    return this.authService.refresh(req.headers.authorization);
  }
}
