import { User } from '@/user/entities/user.entity';
import { DeepPartial } from 'typeorm';

export const dummyUser: DeepPartial<User> = {
  email: 'test@gmail.com',
  nickname: 'test',
  imageUrl: 'images/samples/2.jpg',
};
