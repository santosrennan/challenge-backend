import { Module } from '@nestjs/common';
import { AppController } from './modules/content/infrastructure/controllers/app.controller';
import { AppService } from './modules/content/application/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
