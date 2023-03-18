import { CommonService } from '@/common/common.service';
import { PaginatedResponse } from '@/common/dtos/pagination.dto';
import { BasketItem } from '@/user/entities/basket-item.entity';
import { orderBasketItemSelects } from '@/user/selects/order-basket.selects';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderDto } from './dtos/get-orders.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { ordersSelects } from './selects/orders.selects';
import { GetOrdersParams } from './types/order.types';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,
  ) {}

  async getOrders({
    count,
    lastId,
    userId,
  }: GetOrdersParams): Promise<PaginatedResponse<OrderDto>> {
    return await this.commonService.pagintate({
      count,
      lastId,
      repository: this.orderRepository,
      addWhere: { userId },
      select: ordersSelects,
      relations: {
        orderItems: {
          product: true,
        },
      },
    });
  }

  async createOrderFromBasket(userId: string): Promise<OrderDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const { manager } = queryRunner;

      const basketItems = await manager.find(BasketItem, {
        where: { basketId: userId },
        select: orderBasketItemSelects,
        relations: {
          product: {
            restaurant: true,
          },
        },
      });
      if (basketItems.length === 0) {
        throw new BadRequestException('장바구니에 상품이 없습니다.');
      }

      let totalCount = 0;
      let totalPrice = 0;
      for (const basketItem of basketItems) {
        totalPrice +=
          basketItem.product.price * basketItem.count +
          basketItem.product.restaurant.deliveryFee;
        totalCount += basketItem.count;
      }

      // order item은 foreign key로 orderId를 가지므로  order 먼저 생성
      const order = await manager.save(
        manager.create(Order, {
          totalCount,
          totalPrice,
          userId,
        }),
      );
      // 생성된 order의 id값을 이용하여 order item 생성
      const orderItems = basketItems.map((basketItem) =>
        manager.create(OrderItem, {
          count: basketItem.count,
          productId: basketItem.productId,
          orderId: order.id,
        }),
      );
      await manager.save(orderItems);

      // 장바구니 비우기
      await manager.delete(BasketItem, { basketId: userId });

      // save가 반환한 값에는 join한 값이 존재하지 않으므로 새로 가져와서 응답으로 반환
      const orderWithItems = await manager.findOne(Order, {
        where: { id: order.id },
        select: ordersSelects,
        relations: {
          orderItems: {
            product: true,
          },
        },
      });
      if (!orderWithItems) throw new InternalServerErrorException();

      await queryRunner.commitTransaction();

      return orderWithItems;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
