import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import bcrypt from 'bcrypt';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { dummyUser } from './dummy/user.data';
import { dummyRestaurants } from './dummy/restaurants.data';
import { dummyProductCategories } from './dummy/products.data';
import { Product } from './products/entities/product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async init() {
    const user = await this.userRepository.findOne({
      where: { email: 'test@gmail.com' },
      select: { id: true },
    });

    // User
    // if (user) return 'Already Initialized';
    if (!user) {
      const password = await bcrypt.hash('123', 12);
      await this.userRepository.save(
        this.userRepository.create({
          ...dummyUser,
          password,
        }),
      );
    }

    // Restaurants
    const isExistRestaurants = await this.restaurantRepository.find({
      take: 1,
    });
    if (!isExistRestaurants[0]) {
      // length: 8
      const restaurantInstances = dummyRestaurants.map((dummy) =>
        this.restaurantRepository.create({
          name: dummy.name,
          thumbUrl: `images/${dummy.thumbUrl}`,
          tags: dummy.tags,
          detail: dummy.detail,
          ratings: +(Math.random() + 4.1).toFixed(1), // 4.1 ~ 5 (unit: 0.1)
          ratingsCount: Math.floor(Math.random() * 16 + 5) * 10, // 50 ~ 200 (unit: 10)
          deliveryTime: Math.floor(Math.random() * 5 + 2) * 5, // 10 ~ 30 (unit:5)
          deliveryFee: Math.floor(Math.random() * 5 + 1) * 1000, // 1000 ~ 5000
        }),
      );

      // 8 x 12 = 96개 생성
      await this.restaurantRepository.save(
        [...Array(12)].reduce<Restaurant[]>(
          (acc) => acc.concat(restaurantInstances),
          [],
        ),
      );
      // save에서 반환하는 레스토랑 아이디는 중복된 uuid를 반환하기 때문에 DB에서 새로 가져옴(12개씩 중복됨)
      const restaurants = await this.restaurantRepository.find({
        select: { id: true },
        order: { createdAt: 'ASC' },
      });

      // Products
      for (const [i, restaurant] of restaurants.entries()) {
        console.log(i, restaurant.id);
        const dummyProducts =
          dummyProductCategories[i % dummyProductCategories.length];

        const productInstances = dummyProducts.map((dummy) => {
          const productInstance = this.productRepository.create({
            name: dummy.name,
            imgUrl: `images/${dummy.imgUrl}`,
            detail: dummy.detail,
            price: Math.floor(Math.random() * 11 + 10) * 1000, // 10,000 ~ 20,000 (unit: 1000)
            restaurantId: restaurant.id,
          });

          console.log(productInstance.name, productInstance.restaurantId);

          return productInstance;
        });

        await this.productRepository.save(productInstances);
        console.log(
          '----------------------------------------------------------------------------',
        );
      }
    }

    return 'Initialization Successful';
  }
}
