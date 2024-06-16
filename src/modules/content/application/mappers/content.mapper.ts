import { Injectable } from '@nestjs/common';
import { Content } from '@domain/entities/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';

@Injectable()
export class ContentMapper {
  dtoToEntity(createContentDto: CreateContentDto): Content {
    const { name, description, type } = createContentDto;
    return new Content(name, description, type);
  }

  updateDtoToEntity(
    content: Content,
    updateContentDto: UpdateContentDto,
  ): Content {
    const { name, description, type } = updateContentDto;
    if (name !== undefined) {
      content.name = name;
    }
    if (description !== undefined) {
      content.description = description;
    }
    if (type !== undefined) {
      content.type = type;
    }
    return content;
  }

  entityToDomain(content: Content): Content {
    const { id, name, description, type, views } = content;
    return { id, name, description, type, views };
  }

  domainToEntity(content: Content): Content {
    const { id, name, description, type, views } = content;
    const contentEntity = new Content(name, description, type);
    contentEntity.id = id;
    contentEntity.views = views;
    return contentEntity;
  }
}
