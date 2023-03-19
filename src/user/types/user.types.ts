import { EntityManager } from 'typeorm';

export interface FindBasketItemParams {
  manager: EntityManager;
  basketId: string;
  productId: string;
}

export interface FindBasketItemJoinedProductParams {
  manager: EntityManager;
  id: string;
}

export interface UpdateBasketParams {
  basketId: string;
  productId: string;
}

export interface DeleteFromBasketParams {
  basketId: string;
  basketItemId: string;
}

export interface ChangeNicknameParams {
  userId: string;
  nickname: string;
}
