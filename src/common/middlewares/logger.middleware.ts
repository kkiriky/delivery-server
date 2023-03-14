import { Injectable, NestMiddleware, Inject, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger();

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, httpVersion } = req;
    const userAgent = req.get('user-agent') || '';
    const referrer = req.headers.referer || '';
    const remoteAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (req.headers['x-real-ip'] as string) ||
      req.connection?.remoteAddress;

    next();

    res.on('finish', () => {
      const { statusCode } = res;

      if (this.configService.get('NODE_ENV') === 'production') {
        this.logger.log(
          `${remoteAddress} - "${method} ${originalUrl} HTTP/${httpVersion}" ${statusCode} ${referrer} ${userAgent}`,
        );
      } else {
        this.logger.log(`[${method}](${statusCode}) ${originalUrl} `);
      }
    });
  }
}
