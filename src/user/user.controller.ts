import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { UserId } from '@/common/decorators/user-id.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetMeResponse } from './dtos/getMe.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ type: GetMeResponse })
  @ApiHeaderBearer()
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@UserId() userId: string) {
    return this.userSevice.getMe(userId);
  }
}
