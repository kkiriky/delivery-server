import { AuthGuard } from '@/auth/auth.guard';
import { ApiHeaderBearer } from '@/common/decorators/api-header-bearer.decorator';
import { UserId } from '@/common/decorators/user-id.decorator';
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BasketItemDto, PatchBasketBody } from './dtos/basket.dto';
import { GetMeResponse } from './dtos/get-me.dto';
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
  getMe(@UserId() userId: string) {
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

  @ApiOperation({
    summary: '장바구니에서 상품 빼기',
  })
  @ApiOkResponse({
    schema: {
      nullable: true,
      oneOf: [
        { $ref: getSchemaPath(BasketItemDto) },
        { title: 'NULL', type: 'null' },
      ],
    },
    description: '상품의 개수가 0이면 응답은 null',
  })
  @Patch('basket/subtract')
  subtractFromBasket(
    @UserId() basketId: string,
    @Body() { productId }: PatchBasketBody,
  ): Promise<BasketItemDto | null> {
    return this.userSevice.subtractFromBasket({ basketId, productId });
  }

  // @Post('me/basket/delete')
}
