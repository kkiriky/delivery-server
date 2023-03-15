import { ApiProperty } from '@nestjs/swagger';
import { tokenExample } from '../constants/auth.constants';

export class RefreshResponse {
  @ApiProperty({ example: tokenExample })
  accessToken: string;
}
