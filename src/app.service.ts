import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async init() {
    const dummyUser = await this.userRepository.findOne({
      where: { email: 'test@gmail.com' },
      select: { id: true },
    });

    if (dummyUser) return 'Already Initialized';

    const hash = await bcrypt.hash('123', 12);
    await this.userRepository.save(
      this.userRepository.create({
        email: 'test@gmail.com',
        password: hash,
        imageUrl: '/assets/images/logo/kkiri.png',
      }),
    );

    return 'Initialization Successful';
  }
}
