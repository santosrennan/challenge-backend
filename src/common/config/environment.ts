import * as dotenv from 'dotenv';
dotenv.config();

export const environment = {
  typeorm: {
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  },
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
};
