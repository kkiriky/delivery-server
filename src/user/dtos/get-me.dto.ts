import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class GetMeResponse extends PickType(User, [
  'id',
  'nickname',
  'email',
  'imageUrl',
]) {}
