import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';
import path from 'path';

export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      destination: (_req, _file, done) => {
        done(null, './assets/uploads');
      },
      filename: (_req, file, done) => {
        const ext = path.extname(file.originalname);
        if (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(ext) === false) {
          const error = new BadRequestException(
            '이미지 파일만 업로드 가능합니다.',
          );
          done(error, '');
          return;
        }
        const basename = path.basename(file.originalname, ext);
        done(null, basename + Date.now() + ext);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
