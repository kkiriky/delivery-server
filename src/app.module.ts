import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configModuleOptions } from './common/options/config.options';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exception-filter/all-exception.filter';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptionsFactory } from './common/options/typeorm.options';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { Review } from './restaurant/entities/review.entity';
import { ReviewImage } from './restaurant/entities/review-image.entity';
import { OrderModule } from './order/order.module';
import { Basket } from './user/entities/basket.entity';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      useFactory: typeormOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Basket,
      Restaurant,
      Product,
      Review,
      ReviewImage,
    ]),
    UserModule,
    AuthModule,
    RestaurantModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
