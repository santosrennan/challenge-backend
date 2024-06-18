import { Module } from '@nestjs/common';
import { ContentService } from '@application/services/content.service';
import { ContentResolver } from '@presentation/content.resolver';
import { ContentMapper } from '@application/mappers/content.mapper';
import { DataModule } from './data.module';

@Module({
  imports: [DataModule],
  providers: [ContentService, ContentResolver, ContentMapper],
})
export class ContentModule {}
