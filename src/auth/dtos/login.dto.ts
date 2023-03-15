import { User } from '@/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { tokenExample } from '../constants/auth.constants';

export class LoginBody extends PickType(User, ['email', 'password']) {}

export class LoginResponse {
  @ApiProperty({ example: tokenExample })
  accessToken: string;
  @ApiProperty({ example: tokenExample })
  refreshToken: string;
}
