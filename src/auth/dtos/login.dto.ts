import { User } from '@/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { tokenExample } from '@/common/constants/common.constants';

export class LoginBody extends PickType(User, ['email', 'password']) {}

export class LoginResponse {
  @ApiProperty({ example: tokenExample })
  accessToken: string;
  @ApiProperty({ example: tokenExample })
  refreshToken: string;
}
