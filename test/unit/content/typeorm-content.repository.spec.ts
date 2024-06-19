import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeORMContentRepository } from '@infrastructure/persistence/typeorm/typeorm-content.repository';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentMapper } from '@application/mappers/content.mapper';
import {
  mockContent,
  mockContentEntity,
  mockUserId,
} from '../../mocks/content.mocks';
import { ContentView } from '@domain/entities/content-view.entity';

describe('TypeORMContentRepository', () => {
  let repository: TypeORMContentRepository;
  let contentRepoMock: jest.Mocked<Repository<ContentEntity>>;
  let contentViewRepoMock: jest.Mocked<Repository<ContentViewEntity>>;
  let contentMapper: ContentMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeORMContentRepository,
        ContentMapper,
        {
          provide: getRepositoryToken(ContentEntity),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
            increment: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ContentViewEntity),
          useValue: {
            count: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeORMContentRepository>(TypeORMContentRepository);
    contentRepoMock = module.get<jest.Mocked<Repository<ContentEntity>>>(
      getRepositoryToken(ContentEntity),
    );
    contentViewRepoMock = module.get<
      jest.Mocked<Repository<ContentViewEntity>>
    >(getRepositoryToken(ContentViewEntity));
    contentMapper = module.get<ContentMapper>(ContentMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save content', async () => {
    contentRepoMock.save.mockResolvedValue(mockContentEntity);
    const result = await repository.save(mockContent);
    expect(result).toEqual(mockContent);
    expect(contentRepoMock.save).toHaveBeenCalledWith(
      expect.any(ContentEntity),
    );
  });

  it('should find content by id', async () => {
    contentRepoMock.findOne.mockResolvedValue(mockContentEntity);
    const result = await repository.findById('1');
    expect(result).toEqual(mockContent);
    expect(contentRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should find all contents', async () => {
    contentRepoMock.find.mockResolvedValue([mockContentEntity]);
    const result = await repository.findAll();
    expect(result).toEqual([mockContent]);
    expect(contentRepoMock.find).toHaveBeenCalled();
  });

  it('should delete content by id', async () => {
    await repository.delete('1');
    expect(contentRepoMock.delete).toHaveBeenCalledWith('1');
  });

  it('should increment content views', async () => {
    await repository.incrementViews('1');
    expect(contentRepoMock.increment).toHaveBeenCalledWith(
      { id: '1' },
      'views',
      1,
    );
  });

  it('should check if content has been viewed by user', async () => {
    contentViewRepoMock.count.mockResolvedValue(1);
    const result = await repository.hasViewedContent('1', mockUserId);
    expect(result).toBe(true);
    expect(contentViewRepoMock.count).toHaveBeenCalledWith({
      where: { content: { id: '1' }, userId: mockUserId },
    });
  });

  it('should save content view', async () => {
    contentViewRepoMock.save.mockResolvedValue(undefined);
    const contentView = new ContentView('1', mockUserId);
    await repository.saveContentView(contentView);
    expect(contentViewRepoMock.save).toHaveBeenCalledWith(
      expect.any(ContentViewEntity),
    );
  });
});
