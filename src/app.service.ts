import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import bcrypt from 'bcrypt';
import { Restaurant } from './restaurant/entities/restaurant.entity';
import { dummyUser } from './dummy/user.data';
import { dummyRestaurants } from './dummy/restaurants.data';
import { dummyProductCategories } from './dummy/products.data';
import { Product } from './product/entities/product.entity';
import { dummyReviews } from './dummy/reviews.data';
import { Review } from './restaurant/entities/review.entity';
import { faker } from '@faker-js/faker';
import { ReviewImage } from './restaurant/entities/review-image.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepository: Repository<ReviewImage>,
  ) {}

  async init() {
    const user = await this.userRepository.findOne({
      where: { email: 'test@gmail.com' },
      select: { id: true },
    });

    if (user) return 'Already Initialized';
    // User
    if (!user) {
      const password = await bcrypt.hash('123', 12);
      await this.userRepository.save(
        this.userRepository.create({
          ...dummyUser,
          password,
        }),
      );
    }

    // fake user
    const userInstances = [...Array(20)].map((_, i) =>
      this.userRepository.create({
        email: faker.internet.email(),
        password: '',
        imageUrl: `images/samples/${i % 6}.jpg`,
      }),
    );
    const users = await this.userRepository.save(userInstances);

    // Restaurants
    const isExistRestaurants = await this.restaurantRepository.find({
      take: 1,
    });
    if (!isExistRestaurants[0]) {
      // length: 8
      const restaurantInstances = [...dummyRestaurants].reverse().map((dummy) =>
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

      // Products, Reviews
      for (const [i, restaurant] of restaurants.entries()) {
        // Products
        const dummyProducts = [...dummyProductCategories].reverse()[
          i % dummyProductCategories.length
        ];

        const productInstances = dummyProducts.map((dummy) => {
          const productInstance = this.productRepository.create({
            name: dummy.name,
            imgUrl: `images/${dummy.imgUrl}`,
            detail: dummy.detail,
            price: Math.floor(Math.random() * 11 + 10) * 1000, // 10,000 ~ 20,000 (unit: 1000)
            restaurantId: restaurant.id,
          });

          return productInstance;
        });

        // Reviews
        // length:20
        const reviewInstances = dummyReviews.map((dummy, i) =>
          this.reviewRepository.create({
            content: dummy.content,
            rating: Math.floor(Math.random() * 5 + 1), // 1~5
            userId: users[i].id,
            restaurantId: restaurant.id,
          }),
        );

        await Promise.all([
          this.productRepository.save(productInstances),
          this.reviewRepository.save(
            [...Array(5)].reduce<Review[]>(
              (acc) => acc.concat(reviewInstances),
              [],
            ),
          ),
        ]);

        // 100개의 리뷰
        const reviews = await this.reviewRepository.find({
          where: { restaurantId: restaurant.id },
        });

        // 100개 중 10개의 리뷰에 이미지 할당
        // Review Images
        for (const [index] of [...Array(10)].entries()) {
          // 5장의 리뷰 이미지
          const reviewImageInstances = [...Array(5)].map((_, i) =>
            this.reviewImageRepository.create({
              imgUrl: `images/reviews/${i}.jpg`,
              reviewId: reviews[(index + 1) * 10 - 1].id,
            }),
          );

          await this.reviewImageRepository.save(reviewImageInstances);
        }
      }
    }

    return 'Initialization Successful';
  }
}
