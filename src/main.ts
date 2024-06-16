import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  console.log(
    'Username from env:',
    process.env.TYPEORM_USERNAME,
    process.env.TYPEORM_PASSWORD,
  );
  await app.listen(3000, () => {
    console.log(`Application is running on: http://localhost:3000`);
  });
}
bootstrap();
