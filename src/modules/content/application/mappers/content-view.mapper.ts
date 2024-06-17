import { ContentView } from '@domain/entities/content-view.entity';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';

export class ContentViewMapper {
  static toEntity(domain: ContentView): ContentViewEntity {
    const entity = new ContentViewEntity();
    entity.content = { id: domain.contentId } as ContentEntity;
    entity.userId = domain.userId;
    return entity;
  }

  static toDomain(entity: ContentViewEntity): ContentView {
    return new ContentView(entity.content.id, entity.userId);
  }
}
