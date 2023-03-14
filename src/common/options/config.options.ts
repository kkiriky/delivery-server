import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'development'
      ? '.env.development'
      : '.env.production',
  validationSchema: Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
  }),
};
