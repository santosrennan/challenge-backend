import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentRepository } from '@domain/repositories/content.repository';
import { ContentEntity } from './content.entity';
import { ContentViewEntity } from './content-view.entity';
import { ContentMapper } from '@application/mappers/content.mapper';

@Injectable()
export class TypeORMContentRepository implements ContentRepository {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly contentRepository: Repository<ContentEntity>,

    @InjectRepository(ContentViewEntity)
    private readonly contentViewRepository: Repository<ContentViewEntity>,

    private readonly contentMapper: ContentMapper,
  ) {}

  async save(content: ContentEntity): Promise<ContentEntity> {
    const entity = this.contentMapper.domainToEntity(content);
    const savedEntity = await this.contentRepository.save(entity);
    return this.contentMapper.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<ContentEntity | null> {
    const entity = await this.contentRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.contentMapper.entityToDomain(entity);
  }

  async findAll(): Promise<ContentEntity[]> {
    const entities = await this.contentRepository.find();
    return entities.map((entity) => this.contentMapper.entityToDomain(entity));
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

  async saveContentView(
    contentView: ContentViewEntity,
  ): Promise<ContentViewEntity> {
    return this.contentViewRepository.save(contentView);
  }
}
