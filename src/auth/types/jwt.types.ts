export interface JwtError {
  name: 'TokenExpiredError' | 'JsonWebTokenError' | 'NotBeforeError';
}

export interface JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
}

// type guard
export const isJwtError = (error: any): error is JwtError => 'name' in error;
export const isJwtPayload = (payload: any): payload is JwtPayload =>
  'userId' in payload;
