import { Inject, Injectable } from '@nestjs/common';
import { Content } from '@domain/entities/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';
import { ContentMapper } from '@application/mappers/content.mapper';
import { ContentRepository } from '@domain/repositories/content.repository';

@Injectable()
export class ContentService {
  constructor(
    @Inject('ContentRepository')
    private readonly contentRepository: ContentRepository,
    private readonly contentMapper: ContentMapper,
  ) {}
  async findAll(): Promise<Content[]> {
    return this.contentRepository.findAll();
  }

  async findOne(id: string): Promise<Content | null> {
    return this.contentRepository.findById(id);
  }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentMapper.dtoToEntity(createContentDto);
    const savedContent = await this.contentRepository.save(content);
    return this.contentMapper.entityToDomain(savedContent);
  }

  async update(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content | null> {
    const existingContent = await this.contentRepository.findById(id);
    if (!existingContent) {
      return null;
    }
    const updatedContent = this.contentMapper.updateDtoToEntity(
      existingContent,
      updateContentDto,
    );
    const savedContent = await this.contentRepository.save(updatedContent);
    return this.contentMapper.entityToDomain(savedContent);
  }

  async delete(id: string): Promise<void> {
    await this.contentRepository.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    await this.contentRepository.incrementViews(id);
  }
}
