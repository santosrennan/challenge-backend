import { Injectable } from '@nestjs/common';
import { Content } from '@domain/entities/content.entity';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';

@Injectable()
export class ContentMapper {
  dtoToEntity(createContentDto: CreateContentDto): ContentEntity {
    const { name, description, type } = createContentDto;
    const contentEntity = new ContentEntity(name, description, type);
    return contentEntity;
  }

  updateDtoToEntity(
    contentEntity: ContentEntity,
    updateContentDto: UpdateContentDto,
  ): ContentEntity {
    const { name, description, type } = updateContentDto;
    if (name !== undefined) {
      contentEntity.name = name;
    }
    if (description !== undefined) {
      contentEntity.description = description;
    }
    if (type !== undefined) {
      contentEntity.type = type;
    }
    return contentEntity;
  }

  entityToDomain(contentEntity: ContentEntity): Content {
    const { id, name, description, type, views } = contentEntity;
    return { id, name, description, type, views };
  }

  domainToEntity(content: Content): ContentEntity {
    const { id, name, description, type, views } = content;
    const contentEntity = new ContentEntity(name, description, type);
    contentEntity.id = id;
    contentEntity.views = views;
    return contentEntity;
  }
}
