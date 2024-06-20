import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from '@common/config/environment';
import '../otel-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = environment.app.port;
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`);
  });
}
bootstrap();
