import { CommonService } from '@/common/common.service';
import { PaginatedResponse } from '@/common/dtos/pagination.dto';
import { Product } from '@/product/entities/product.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderParams } from './dtos/create-order.dto';
import { OrderDto, GetOrdersParams } from './dtos/get-orders.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { ordersSelects } from './selects/orders.selects';

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

  // 장바구니 주문을 별도로 만들자
  createOrderFromBaskets() {
    //
  }

  async createOrder({
    products,
    userId,
  }: CreateOrderParams): Promise<OrderDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      queryRunner.startTransaction();
      const { manager } = queryRunner;

      let totalPrice = 0;
      let totalCount = 0;
      for (const $product of products) {
        const product = await manager.findOne(Product, {
          where: { id: $product.productId },
          select: {
            id: true,
            price: true,
          },
        });
        if (!product) {
          throw new BadRequestException('존재하지 않는 상품입니다.');
        }
        totalPrice += product.price;
        totalCount += $product.count;
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
      const orderItems = products.map((product) =>
        manager.create(OrderItem, {
          count: product.count,
          productId: product.productId,
          orderId: order.id,
        }),
      );
      await manager.save(orderItems);

      // 장바구니 비우기

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
      if (!orderWithItems) {
        throw new InternalServerErrorException();
      }
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
