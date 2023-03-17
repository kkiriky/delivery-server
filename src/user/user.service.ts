import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BasketItemDto, UpdateBasketParams } from './dtos/basket.dto';
import { BasketItem } from './entities/basket-item.entity';
import { User } from './entities/user.entity';
import { basketItemsSelects } from './selects/basketItems.selects';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(BasketItem)
    private readonly basketItemRepository: Repository<BasketItem>,

    private readonly dataSource: DataSource,
  ) {}

  async getMe(id: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      select: {
        id: true,
        email: true,
        imageUrl: true,
      },
    });

    return user;
  }

  async getBasket(userId: string): Promise<BasketItemDto[]> {
    const basketItems = await this.basketItemRepository.find({
      where: { basketId: userId },
      select: basketItemsSelects,
      relations: {
        product: true,
      },
    });

    return basketItems;
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

      let basketItem = await manager.findOne(BasketItem, {
        where: { basketId, productId },
        select: {
          id: true,
          count: true,
        },
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

      const basketItemWithProduct = await manager.findOne(BasketItem, {
        where: { id: basketItem.id },
        select: basketItemsSelects,
        relations: {
          product: true,
        },
      });
      if (!basketItemWithProduct) {
        throw new InternalServerErrorException();
      }
      await queryRunner.commitTransaction();

      return basketItemWithProduct;
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

      // 중복
      const basketItem = await manager.findOne(BasketItem, {
        where: { basketId, productId },
        select: {
          id: true,
          count: true,
        },
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

      // 중복
      const basketItemWithProduct = await manager.findOne(BasketItem, {
        where: { id: basketItem.id },
        select: basketItemsSelects,
        relations: {
          product: true,
        },
      });

      await queryRunner.commitTransaction();

      return basketItemWithProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
