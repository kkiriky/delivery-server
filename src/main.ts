import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';
  const logger = new Logger('Server');
  const PORT = configService.get('PORT') || 3000;

  if (isProduction) {
    app.use(helmet());
  }

  app.set('trust proxy', 1);

  // Get /images/..., GET /uploads/...
  app.useStaticAssets(path.join(process.cwd(), 'assets'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Kkiri Delivery')
      .setDescription('Kkiri Delivery API 문서')
      .setVersion('1.0')
      .addTag('Kkiri')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(PORT, () =>
    logger.log(`${PORT}번 포트에서 서버 실행 중  ✅ `),
  );
}
bootstrap();
