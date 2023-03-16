import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMe(id: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      select: {
        id: true,
        email: true,
        imageUrl: true,
      },
    });

    return user;
  }
}
