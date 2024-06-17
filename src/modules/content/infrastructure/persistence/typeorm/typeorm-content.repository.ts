import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentRepository } from '@domain/repositories/content.repository';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentMapper } from '@application/mappers/content.mapper';
import { ContentViewMapper } from '@application/mappers/content-view.mapper';
import { Content } from '@domain/entities/content.entity';
import { ContentView } from '@domain/entities/content-view.entity';

@Injectable()
export class TypeORMContentRepository implements ContentRepository {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,

    @InjectRepository(ContentViewEntity)
    private readonly contentViewRepository: Repository<ContentViewEntity>,

    private readonly contentMapper: ContentMapper,
  ) {}

  async save(content: Content): Promise<Content> {
    const entity = this.contentMapper.domainToEntity(content);
    return this.contentRepository
      .save(entity)
      .then(this.contentMapper.entityToDomain);
  }

  async findById(id: string): Promise<Content | null> {
    return this.contentRepository
      .findOne({ where: { id } })
      .then((entity) =>
        entity ? this.contentMapper.entityToDomain(entity) : null,
      );
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository
      .find()
      .then((entities) => entities.map(this.contentMapper.entityToDomain));
  }

  async delete(id: string): Promise<void> {
    await this.contentRepository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.contentRepository.increment({ id }, 'views', 1);
  }

  async hasViewedContent(contentId: string, userId: string): Promise<boolean> {
    const count = await this.contentViewRepository.count({
      where: { content: { id: contentId }, userId },
    });
    return count > 0;
  }

  async saveContentView(contentView: ContentView): Promise<void> {
    const entity = ContentViewMapper.toEntity(contentView);
    await this.contentViewRepository.save(entity);
  }
}
