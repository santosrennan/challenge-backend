import { ContentMapper } from '@application/mappers/content.mapper';
import {
  mockContent,
  mockCreateContentDto,
  mockUpdateContentDto,
  mockContentEntity,
  mockUpdatedContentEntity,
} from '../../mocks/content.mocks';
import { ContentType } from '@common/enums/content-type.enum';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';

function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

describe('ContentMapper', () => {
  let contentMapper: ContentMapper;

  beforeEach(() => {
    contentMapper = new ContentMapper();
  });

  it('should map CreateContentDto to ContentEntity', () => {
    const result = contentMapper.dtoToEntity(mockCreateContentDto);
    expect(result).toBeInstanceOf(ContentEntity);
    expect(result.name).toBe(mockCreateContentDto.name);
    expect(result.description).toBe(mockCreateContentDto.description);
    expect(result.type).toBe(mockCreateContentDto.type);
  });

  it('should map ContentEntity to Content', () => {
    const contentEntity = cloneDeep(mockContentEntity);
    const result = contentMapper.entityToDomain(contentEntity);
    expect(result).toMatchObject({
      id: '1',
      name: 'Test',
      description: 'Test',
      type: ContentType.VIDEO,
      views: 0,
    });
  });

  it('should map UpdateContentDto to ContentEntity', () => {
    const result = contentMapper.updateDtoToEntity(
      mockContentEntity,
      mockUpdateContentDto,
    );
    expect(result).toBeInstanceOf(ContentEntity);
    expect(result.name).toBe(mockUpdateContentDto.name);
    expect(result.description).toBe(mockUpdateContentDto.description);
    expect(result.type).toBe(mockUpdateContentDto.type);
  });
  it('should map Content to ContentEntity', () => {
    const result = contentMapper.domainToEntity(mockContent);
    expect(result).toBeInstanceOf(ContentEntity);
    expect(result.id).toBe(mockContent.id);
    expect(result.name).toBe(mockContent.name);
    expect(result.description).toBe(mockContent.description);
    expect(result.type).toBe(mockContent.type);
    expect(result.views).toBe(mockContent.views);
  });

  it('should map updated ContentEntity to Content', () => {
    const updatedContentEntity = cloneDeep(mockUpdatedContentEntity);
    const result = contentMapper.entityToDomain(updatedContentEntity);
    expect(result).toMatchObject({
      id: '1',
      name: 'Updated Name',
      description: 'Updated Description',
      type: ContentType.PDF,
      views: 0,
    });
  });

  it('should map updated Content to ContentEntity', () => {
    const updatedContent = {
      id: '1',
      name: 'Updated Name',
      description: 'Updated Description',
      type: ContentType.PDF,
      views: 0,
    };
    const result = contentMapper.domainToEntity(updatedContent);
    expect(result).toBeInstanceOf(ContentEntity);
    expect(result.id).toBe(updatedContent.id);
    expect(result.name).toBe(updatedContent.name);
    expect(result.description).toBe(updatedContent.description);
    expect(result.type).toBe(updatedContent.type);
    expect(result.views).toBe(updatedContent.views);
  });
});
