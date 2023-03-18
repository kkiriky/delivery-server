import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { ApiOkNullableResponse } from '@/common/decorators/api-ok-nullable-response.decorator';
import { UserId } from '@/common/decorators/user-id.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  BasketItemDto,
  BasketItemIdParam,
  PatchBasketBody,
} from './dtos/basket.dto';
import { GetMeResponse } from './dtos/get-me.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@ApiHeaderBearer()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userSevice: UserService) {}

  @ApiOperation({ summary: '내 정보 가져오기' })
  @ApiOkResponse({ type: GetMeResponse })
  @Get('me')
  getMe(@UserId() userId: string): Promise<User> {
    return this.userSevice.getMe(userId);
  }

  @ApiOperation({ summary: '내 장바구니 가져오기' })
  @ApiOkResponse({ type: [BasketItemDto] })
  @Get('basket')
  getBasket(@UserId() userId: string): Promise<BasketItemDto[]> {
    return this.userSevice.getBasket(userId);
  }

  @ApiOperation({ summary: '장바구니에 상품 추가' })
  @ApiOkResponse({ type: BasketItemDto })
  @Patch('basket/add')
  addToBasket(
    @UserId() basketId: string,
    @Body() { productId }: PatchBasketBody,
  ): Promise<BasketItemDto> {
    return this.userSevice.addToBasket({ basketId, productId });
  }

  @ApiOperation({ summary: '장바구니에서 상품 빼기' })
  @ApiOkNullableResponse(BasketItemDto, {
    description: '상품의 개수가 0이면 응답은 null',
  })
  @Patch('basket/subtract')
  subtractFromBasket(
    @UserId() basketId: string,
    @Body() { productId }: PatchBasketBody,
  ): Promise<BasketItemDto | null> {
    return this.userSevice.subtractFromBasket({ basketId, productId });
  }

  @ApiOperation({ summary: '장바구니에서 상품 완전히 제거' })
  @ApiOkResponse({ description: 'ok' })
  @Delete('basket/:basketItemId')
  deleteFromBasket(
    @UserId() basketId: string,
    @Param() { basketItemId }: BasketItemIdParam,
  ): Promise<string> {
    return this.userSevice.deleteFromBasket({ basketId, basketItemId });
  }
}
