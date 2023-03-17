import { OrderItem } from '@/order/entities/order-item.entity';
import { Order } from '@/order/entities/order.entity';
import { Product } from '@/product/entities/product.entity';
import { Restaurant } from '@/restaurant/entities/restaurant.entity';
import { ReviewImage } from '@/review/entities/review-image.entity';
import { Review } from '@/review/entities/review.entity';
import { BasketItem } from '@/user/entities/basket-item.entity';
import { Basket } from '@/user/entities/basket.entity';
import { User } from '@/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormOptionsFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  timezone: 'Z',
  charset: 'utf8mb4',
  entities: [
    User,
    Restaurant,
    Product,
    Basket,
    BasketItem,
    Order,
    OrderItem,
    Review,
    ReviewImage,
  ],
});
