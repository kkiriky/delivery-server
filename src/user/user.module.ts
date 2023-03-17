import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketItem } from './entities/basket-item.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, BasketItem])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
