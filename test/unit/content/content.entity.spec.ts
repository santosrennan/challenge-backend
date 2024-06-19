import { ContentType } from '@common/enums/content-type.enum';
import { Content } from '@domain/entities/content.entity';
import { mockContent, mockContents } from '../../mocks/content.mocks';

describe('Content Entity', () => {
  it('should create a Content object', () => {
    const content = new Content('Test', 'Description', ContentType.VIDEO);
    expect(content.name).toBe('Test');
    expect(content.description).toBe('Description');
    expect(content.type).toBe(ContentType.VIDEO);
    expect(content.views).toBe(0);
  });

  it('should initialize views to 0', () => {
    const content = new Content('Test', 'Description', ContentType.VIDEO);
    expect(content.views).toBe(0);
  });

  it('should correctly initialize from mock', () => {
    expect(mockContent.id).toBe('1');
    expect(mockContent.name).toBe('Test');
    expect(mockContent.description).toBe('Test');
    expect(mockContent.type).toBe(ContentType.VIDEO);
    expect(mockContent.views).toBe(0);
  });

  it('should retrieve multiple contents from mock', () => {
    expect(mockContents.length).toBe(2);
    expect(mockContents[0].id).toBe('1');
    expect(mockContents[1].id).toBe('2');
  });
});
