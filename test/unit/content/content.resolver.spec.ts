import { Test, TestingModule } from '@nestjs/testing';
import { ContentResolver } from '@presentation/content.resolver';
import { ContentService } from '@application/services/content.service';
import { RolesGuard } from '@common/auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import {
  mockContent,
  mockCreateContentDto,
  mockUpdateContentDto,
  mockUserId,
  mockUserRoleAdmin,
  mockContents,
} from '../../mocks/content.mocks';
import { UserRole } from '@common/auth/roles.enum';

const mockContentService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockRolesGuard = {
  canActivate: jest.fn((context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user || context.getArgs()[2]?.req?.user;
    return user && user.role === UserRole.ADMIN;
  }),
};

describe('ContentResolver', () => {
  let resolver: ContentResolver;
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentResolver,
        {
          provide: ContentService,
          useValue: mockContentService,
        },
        {
          provide: RolesGuard,
          useValue: mockRolesGuard,
        },
        Reflector,
      ],
    }).compile();

    resolver = module.get<ContentResolver>(ContentResolver);
    service = module.get<ContentService>(ContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('contents', () => {
    it('should return an array of contents', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockContents);
      expect(await resolver.contents()).toBe(mockContents);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('content', () => {
    it('should return a single content', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockContent);

      const req = { user: { role: mockUserRoleAdmin, id: mockUserId } };
      const result = await resolver.content('1', req);

      expect(result).toBe(mockContent);
      expect(service.findOne).toHaveBeenCalledWith(
        '1',
        mockUserRoleAdmin,
        mockUserId,
      );
    });
  });

  describe('createContent', () => {
    it('should create and return a content', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockContent);
      const req = { user: { role: mockUserRoleAdmin } };
      await expect(
        resolver.createContent(
          req,
          mockCreateContentDto.name,
          mockCreateContentDto.description,
          mockCreateContentDto.type,
        ),
      ).resolves.toBe(mockContent);
      expect(service.create).toHaveBeenCalledWith(mockCreateContentDto);
    });
  });

  describe('updateContent', () => {
    it('should update and return a content', async () => {
      const updatedContent = { ...mockContent, ...mockUpdateContentDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedContent);
      const req = { user: { role: mockUserRoleAdmin } };
      await expect(
        resolver.updateContent(
          req,
          '1',
          mockUpdateContentDto.name,
          mockUpdateContentDto.description,
          mockUpdateContentDto.type,
        ),
      ).resolves.toBe(updatedContent);
      expect(service.update).toHaveBeenCalledWith('1', mockUpdateContentDto);
    });
  });

  describe('deleteContent', () => {
    it('should delete a content', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue();
      const req = { user: { role: mockUserRoleAdmin } };
      await expect(resolver.deleteContent(req, '1')).resolves.toBe(true);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
