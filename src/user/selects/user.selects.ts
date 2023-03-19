import { FindOptionsSelect } from 'typeorm';
import { User } from '../entities/user.entity';

export const userSelects: FindOptionsSelect<User> = {
  id: true,
  nickname: true,
  email: true,
  imageUrl: true,
};
