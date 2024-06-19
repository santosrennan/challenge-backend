import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, DeleteResult } from 'typeorm';
import { ContentViewEntity } from '@infrastructure/persistence/typeorm/content-view.entity';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import { ContentType } from '@common/enums/content-type.enum';

describe('ContentViewEntity', () => {
  let contentViewRepo: jest.Mocked<Repository<ContentViewEntity>>;
  let contentRepo: jest.Mocked<Repository<ContentEntity>>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(ContentViewEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ContentEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    contentViewRepo = module.get<jest.Mocked<Repository<ContentViewEntity>>>(
      getRepositoryToken(ContentViewEntity),
    );
    contentRepo = module.get<jest.Mocked<Repository<ContentEntity>>>(
      getRepositoryToken(ContentEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a ContentViewEntity', async () => {
    const content = new ContentEntity(
      'Test',
      'Test Description',
      ContentType.VIDEO,
    );
    content.id = '1';
    const contentView = new ContentViewEntity();
    contentView.id = '1';
    contentView.content = content;
    contentView.userId = 'user1';

    contentViewRepo.save.mockResolvedValue(contentView);

    const result = await contentViewRepo.save(contentView);
    expect(result).toBe(contentView);
    expect(result.content).toBe(content);
    expect(result.userId).toBe('user1');
  });

  it('should find a ContentViewEntity by id', async () => {
    const content = new ContentEntity(
      'Test',
      'Test Description',
      ContentType.VIDEO,
    );
    content.id = '1';
    const contentView = new ContentViewEntity();
    contentView.id = '1';
    contentView.content = content;
    contentView.userId = 'user1';

    contentViewRepo.findOne.mockResolvedValue(contentView);

    const result = await contentViewRepo.findOne({ where: { id: '1' } });
    expect(result).toBe(contentView);
    expect(result.content).toBe(content);
    expect(result.userId).toBe('user1');
  });

  it('should delete a ContentViewEntity', async () => {
    const deleteResult: DeleteResult = { affected: 1, raw: [] };

    contentViewRepo.delete.mockResolvedValue(deleteResult);

    const result = await contentViewRepo.delete('1');
    expect(result).toBe(deleteResult);
    expect(contentViewRepo.delete).toHaveBeenCalledWith('1');
  });
});
