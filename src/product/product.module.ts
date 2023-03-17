import { CommonModule } from '@/common/common.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CommonModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
