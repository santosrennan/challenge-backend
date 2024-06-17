import { Inject, Injectable } from '@nestjs/common';
import { Content } from '@domain/entities/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';
import { ContentMapper } from '@application/mappers/content.mapper';
import { ContentRepository } from '@domain/repositories/content.repository';
import { UserRole } from '@common/auth/roles.enum';
import { ContentView } from '@domain/entities/content-view.entity';

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

  async findOne(
    id: string,
    userRole: UserRole,
    userId: string,
  ): Promise<Content | null> {
    const content = await this.contentRepository.findById(id);
    if (!content) {
      return null;
    }

    if (userRole === UserRole.STUDENT) {
      await this.incrementViews(id, userId);
    }

    return content;
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

  private async incrementViews(id: string, userId: string): Promise<void> {
    const hasViewed = await this.contentRepository.hasViewedContent(id, userId);

    if (!hasViewed) {
      await this.contentRepository.incrementViews(id);

      const contentView = new ContentView(id, userId);
      await this.contentRepository.saveContentView(contentView);
    }
  }
}
