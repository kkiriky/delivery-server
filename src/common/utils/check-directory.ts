import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';

export const checkDirectory = (directory: string) => {
  const logger = new Logger('DirCheck');
  try {
    fs.readdirSync(path.join(process.cwd(), directory));
  } catch (err) {
    logger.log(
      `지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`,
    );
    fs.mkdirSync(path.join(process.cwd(), directory));
  }
};
