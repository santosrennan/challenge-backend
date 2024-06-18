// test/unit/services/content.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from '@application/services/content.service';
import { ContentRepository } from '@domain/repositories/content.repository';
import { ContentMapper } from '@application/mappers/content.mapper';
import {
  mockContent,
  mockCreateContentDto,
  mockUpdateContentDto,
  mockUserId,
  mockUserRoleStudent,
  mockUserRoleAdmin,
} from '../../mocks/content.mocks';
import { ContentView } from '@domain/entities/content-view.entity';

describe('ContentService', () => {
  let service: ContentService;
  let contentRepository: jest.Mocked<ContentRepository>;
  let contentMapper: jest.Mocked<ContentMapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: 'ContentRepository',
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            incrementViews: jest.fn(),
            hasViewedContent: jest.fn(),
            saveContentView: jest.fn(),
          },
        },
        {
          provide: ContentMapper,
          useValue: {
            dtoToEntity: jest.fn(),
            updateDtoToEntity: jest.fn(),
            entityToDomain: jest.fn(),
            domainToEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    contentRepository =
      module.get<jest.Mocked<ContentRepository>>('ContentRepository');
    contentMapper = module.get<jest.Mocked<ContentMapper>>(ContentMapper);
  });

  it('should find all contents', async () => {
    contentRepository.findAll.mockResolvedValue([mockContent]);

    const result = await service.findAll();

    expect(result).toEqual([mockContent]);
    expect(contentRepository.findAll).toHaveBeenCalled();
  });

  it('should find one content and increment views for students', async () => {
    contentRepository.findById.mockResolvedValue(mockContent);
    jest
      .spyOn(service as any, 'incrementViews')
      .mockResolvedValue(Promise.resolve());

    const result = await service.findOne('1', mockUserRoleStudent, mockUserId);

    expect(result).toEqual(mockContent);
    expect(contentRepository.findById).toHaveBeenCalledWith('1');
    expect(service['incrementViews']).toHaveBeenCalledWith('1', mockUserId);
  });

  it('should not increment views for admins', async () => {
    contentRepository.findById.mockResolvedValue(mockContent);
    jest
      .spyOn(service as any, 'incrementViews')
      .mockResolvedValue(Promise.resolve());

    const result = await service.findOne('1', mockUserRoleAdmin, mockUserId);

    expect(result).toEqual(mockContent);
    expect(contentRepository.findById).toHaveBeenCalledWith('1');
    expect(service['incrementViews']).not.toHaveBeenCalled();
  });

  it('should create content', async () => {
    const contentEntity = mockContent;
    const savedContent = { ...contentEntity, id: '1' };

    contentMapper.dtoToEntity.mockReturnValue(contentEntity);
    contentRepository.save.mockResolvedValue(savedContent);
    contentMapper.entityToDomain.mockReturnValue(savedContent);

    const result = await service.create(mockCreateContentDto);

    expect(result).toEqual(savedContent);
    expect(contentMapper.dtoToEntity).toHaveBeenCalledWith(
      mockCreateContentDto,
    );
    expect(contentRepository.save).toHaveBeenCalledWith(contentEntity);
    expect(contentMapper.entityToDomain).toHaveBeenCalledWith(savedContent);
  });

  it('should update content', async () => {
    const updatedContent = { ...mockContent, ...mockUpdateContentDto };

    contentRepository.findById.mockResolvedValue(mockContent);
    contentMapper.updateDtoToEntity.mockReturnValue(updatedContent);
    contentRepository.save.mockResolvedValue(updatedContent);
    contentMapper.entityToDomain.mockReturnValue(updatedContent);

    const result = await service.update('1', mockUpdateContentDto);

    expect(result).toEqual(updatedContent);
    expect(contentRepository.findById).toHaveBeenCalledWith('1');
    expect(contentMapper.updateDtoToEntity).toHaveBeenCalledWith(
      mockContent,
      mockUpdateContentDto,
    );
    expect(contentRepository.save).toHaveBeenCalledWith(updatedContent);
    expect(contentMapper.entityToDomain).toHaveBeenCalledWith(updatedContent);
  });

  it('should delete content', async () => {
    contentRepository.delete.mockResolvedValue();

    await service.delete('1');

    expect(contentRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should increment views for new views', async () => {
    contentRepository.hasViewedContent.mockResolvedValue(false);
    contentRepository.incrementViews.mockResolvedValue();
    contentRepository.saveContentView.mockResolvedValue();

    await (service as any).incrementViews('1', mockUserId);

    expect(contentRepository.hasViewedContent).toHaveBeenCalledWith(
      '1',
      mockUserId,
    );
    expect(contentRepository.incrementViews).toHaveBeenCalledWith('1');
    expect(contentRepository.saveContentView).toHaveBeenCalledWith(
      new ContentView('1', mockUserId),
    );
  });

  it('should not increment views for already viewed content', async () => {
    contentRepository.hasViewedContent.mockResolvedValue(true);

    await (service as any).incrementViews('1', mockUserId);

    expect(contentRepository.hasViewedContent).toHaveBeenCalledWith(
      '1',
      mockUserId,
    );
    expect(contentRepository.incrementViews).not.toHaveBeenCalled();
    expect(contentRepository.saveContentView).not.toHaveBeenCalled();
  });
});
