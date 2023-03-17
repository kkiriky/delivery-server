import { OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class GetProducts extends OmitType(Product, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
