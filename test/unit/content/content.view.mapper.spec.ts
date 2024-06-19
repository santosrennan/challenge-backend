import { ContentView } from '@domain/entities/content-view.entity';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentViewMapper } from '@application/mappers/content-view.mapper';

describe('ContentViewMapper', () => {
  describe('toEntity', () => {
    it('should correctly map ContentView to ContentViewEntity', () => {
      const domain: ContentView = {
        contentId: '1',
        userId: 'user1',
      };

      const result = ContentViewMapper.toEntity(domain);

      expect(result).toBeInstanceOf(ContentViewEntity);
      expect(result.userId).toEqual(domain.userId);
      expect(result.content).toBeDefined();
      expect(result.content.id).toEqual(domain.contentId);
    });
  });
  describe('toDomain', () => {
    it('should correctly map ContentViewEntity to ContentView', () => {
      const entity: ContentViewEntity = {
        id: '1',
        userId: 'user1',
        content: {
          id: '1',
          name: 'Test Content',
          description: 'Description',
          type: 'video',
          views: 0,
        },
      } as any;
      const result = ContentViewMapper.toDomain(entity);

      expect(result).toBeInstanceOf(ContentView);
      expect(result.userId).toEqual(entity.userId);
      expect(result.contentId).toEqual(entity.content.id);
    });
  });
});
