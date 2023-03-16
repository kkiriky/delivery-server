import { OrderItem } from '@/orders/entities/order-item.entity';
import { Order } from '@/orders/entities/order.entity';
import { Product } from '@/products/entities/product.entity';
import { Restaurant } from '@/restaurants/entities/restaurant.entity';
import { ReviewImage } from '@/reviews/entities/review-image.entity';
import { Review } from '@/reviews/entities/review.entity';
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
  timezone: '+09:00',
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
