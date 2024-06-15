import { Module } from '@nestjs/common';
import { ContentService } from './application/services/content.service';

@Module({
  providers: [ContentService],
})
export class ContentModule {}
