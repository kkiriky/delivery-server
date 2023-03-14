import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Error');
  private readonly serverError = {
    message: '서버 문제로 요청에 실패하였습니다. 잠시 후에 시도해 주세요.',
    error: 'Server Error',
  };

  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 서버 내에서 알 수 없는(캐치하지 못한) 에러 발생시 상태 코드를 500으로 응답
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 서버 내에서 알 수 없는(캐치하지 못한) 에러 발생시 에러 객체를 지정해서 응답
    let error =
      exception instanceof HttpException
        ? exception.getResponse()
        : this.serverError;

    // HttpException을 포함한 모든 Exception에 대해서 에러를 로깅함
    this.logger.error(error);
    this.logger.error(exception.stack);

    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      error = this.serverError;
    }

    if (typeof error === 'string') {
      response.status(statusCode).json({
        statusCode,
        error,
      });
    } else {
      response.status(statusCode).json({
        statusCode,
        ...error,
      });
    }
  }
}
