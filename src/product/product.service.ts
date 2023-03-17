import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import {
  PaginatedResponse,
  PaginationQueries,
} from '@/common/dtos/pagination.dto';
import { GetProducts } from './dtos/get-products.dto';
import { productsSelects } from './selects/products.select';
import { CommonService } from '@/common/common.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly commonService: CommonService,
  ) {}

  async getProducts({
    count,
    lastId,
  }: PaginationQueries): Promise<PaginatedResponse<GetProducts>> {
    return this.commonService.pagintate({
      count,
      lastId,
      repository: this.productRepository,
      select: productsSelects,
    });
  }
}
