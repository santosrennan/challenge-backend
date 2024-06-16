import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMContentRepository } from '@infrastructure/persistence/typeorm/typeorm-content.repository';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import { ContentMapper } from '@application/mappers/content.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ContentEntity, ContentViewEntity])],
  providers: [
    {
      provide: 'ContentRepository',
      useClass: TypeORMContentRepository,
    },
    ContentMapper,
  ],
  exports: ['ContentRepository'],
})
export class DataModule {}
