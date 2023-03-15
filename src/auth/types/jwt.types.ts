export interface JwtError {
  name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError';
}

export const isJwtError = (error: any): error is JwtError => 'name' in error;

export interface JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
}

export const isJwtPayload = (payload: any): payload is JwtPayload =>
  'userId' in payload;
