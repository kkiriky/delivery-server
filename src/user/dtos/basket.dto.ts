import { uuidExample } from '@/common/constants/common.constants';
import { StringInput } from '@/common/decorators/input-property.decorator';
import { Product } from '@/product/entities/product.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BasketItem } from '../entities/basket-item.entity';

class BasketProduct extends PickType(Product, [
  'id',
  'name',
  'imgUrl',
  'detail',
  'price',
]) {}

export class BasketItemDto extends PickType(BasketItem, ['id', 'count']) {
  @ApiProperty({ type: BasketProduct })
  product: BasketProduct;
}

export class PatchBasketBody {
  @StringInput({ example: uuidExample })
  productId: string;
}

export class BasketItemIdParam {
  @StringInput({ example: uuidExample })
  basketItemId: string;
}
