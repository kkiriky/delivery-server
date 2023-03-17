import { ApiProperty } from '@nestjs/swagger';
import { tokenExample } from '@/common/constants/common.constants';

export class RefreshResponse {
  @ApiProperty({ example: tokenExample })
  accessToken: string;
}
