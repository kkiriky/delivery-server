import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BasketItemDto } from './dtos/basket.dto';
import { EditProfileResponse } from './dtos/edit-profile.dto';
import { BasketItem } from './entities/basket-item.entity';
import { User } from './entities/user.entity';
import { basketItemsSelects } from './selects/basketItems.selects';
import { userSelects } from './selects/user.selects';
import {
  EditProfileParams,
  DeleteFromBasketParams,
  FindBasketItemJoinedProductParams,
  FindBasketItemParams,
  UpdateBasketParams,
} from './types/user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BasketItem)
    private readonly basketItemRepository: Repository<BasketItem>,

    private readonly dataSource: DataSource,
  ) {}

  async getMe(id: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      select: userSelects,
    });

    return user;
  }

  async getBasket(basketId: string): Promise<BasketItemDto[]> {
    const basketItems = await this.basketItemRepository.find({
      where: { basketId },
      select: basketItemsSelects,
      relations: {
        product: {
          restaurant: true,
        },
      },
    });

    return basketItems;
  }

  async editProfile({
    userId,
    nickname,
    file,
  }: EditProfileParams): Promise<EditProfileResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        imageUrl: true,
      },
    });
    if (!user) throw new BadRequestException();

    const isChangeNickname = user.nickname !== nickname;

    if (isChangeNickname) {
      const isExistNickname = await this.userRepository.findOne({
        where: { nickname },
        select: { id: true },
      });
      if (isExistNickname) {
        throw new BadRequestException('이미 사용 중인 닉네임입니다.');
      }
      await this.userRepository.update(userId, { nickname });
    }

    let imageUrl = '';
    if (file) {
      imageUrl = `uploads/${file.filename}`;
      await this.userRepository.update(userId, {
        imageUrl,
      });
    }

    return {
      nickname,
      imageUrl: file ? imageUrl : user.imageUrl,
    };
  }

  async addToBasket({
    basketId,
    productId,
  }: UpdateBasketParams): Promise<BasketItemDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      let basketItem = await this.findBasketItem({
        manager,
        basketId,
        productId,
      });

      if (!basketItem) {
        basketItem = await manager.save(
          manager.create(BasketItem, {
            count: 1,
            productId,
            basketId,
          }),
        );
      } else {
        await manager.update(
          BasketItem,
          { id: basketItem.id },
          {
            count: basketItem.count + 1,
          },
        );
      }

      const basketItemJoinedProduct = await this.findBaksetItemJoinedProduct({
        manager,
        id: basketItem.id,
      });
      if (!basketItemJoinedProduct) throw new InternalServerErrorException();

      await queryRunner.commitTransaction();

      return basketItemJoinedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async subtractFromBasket({
    basketId,
    productId,
  }: UpdateBasketParams): Promise<BasketItemDto | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      const basketItem = await this.findBasketItem({
        manager,
        basketId,
        productId,
      });

      if (!basketItem) {
        throw new BadRequestException(
          '장바구니에 해당 상품이 존재하지 않습니다.',
        );
      }

      if (basketItem.count === 1) {
        await manager.delete(BasketItem, { id: basketItem.id });
      } else {
        await manager.update(
          BasketItem,
          { id: basketItem.id },
          { count: basketItem.count - 1 },
        );
      }

      const basketItemJoinedProduct = await this.findBaksetItemJoinedProduct({
        manager,
        id: basketItem.id,
      });

      await queryRunner.commitTransaction();

      return basketItemJoinedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFromBasket({
    basketId,
    basketItemId,
  }: DeleteFromBasketParams): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      const basketItem = await manager.findOne(BasketItem, {
        where: { id: basketItemId, basketId },
        select: {
          id: true,
          basketId: true,
        },
      });
      if (!basketItem) {
        throw new BadRequestException('장바구니에 상품이 존재하지 않습니다.');
      }

      await manager.delete(BasketItem, { id: basketItemId });

      await queryRunner.commitTransaction();

      return 'ok';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async findBasketItem({
    manager,
    basketId,
    productId,
  }: FindBasketItemParams) {
    return await manager.findOne(BasketItem, {
      where: { basketId, productId },
      select: {
        id: true,
        count: true,
      },
    });
  }

  private async findBaksetItemJoinedProduct({
    manager,
    id,
  }: FindBasketItemJoinedProductParams) {
    return manager.findOne(BasketItem, {
      where: { id },
      select: basketItemsSelects,
      relations: {
        product: {
          restaurant: true,
        },
      },
    });
  }
}
