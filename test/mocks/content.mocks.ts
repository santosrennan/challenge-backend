import { Content } from '@domain/entities/content.entity';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';
import { ContentType } from '@common/enums/content-type.enum';
import { UserRole } from '@common/auth/roles.enum';

export const mockContent: Content = {
  id: '1',
  name: 'Test',
  description: 'Test',
  type: ContentType.VIDEO,
  views: 0,
};

export const mockCreateContentDto: CreateContentDto = {
  name: 'Test',
  description: 'Test',
  type: ContentType.VIDEO,
};

export const mockUpdateContentDto: UpdateContentDto = {
  name: 'Updated Test',
  description: 'Updated Description',
  type: ContentType.PDF,
};

export const mockUserId = 'user1';
export const mockUserRoleStudent = UserRole.STUDENT;
export const mockUserRoleAdmin = UserRole.ADMIN;

export const mockContents: Content[] = [
  {
    id: '1',
    name: 'Test 1',
    description: 'Test 1',
    type: ContentType.VIDEO,
    views: 0,
  },
  {
    id: '2',
    name: 'Test 2',
    description: 'Test 2',
    type: ContentType.PDF,
    views: 0,
  },
];

export const mockContentEntity: ContentEntity = new ContentEntity(
  'Test',
  'Test',
  ContentType.VIDEO,
);
mockContentEntity.id = '1';
mockContentEntity.views = 0;

export const mockUpdatedContentEntity: ContentEntity = new ContentEntity(
  'Updated Name',
  'Updated Description',
  ContentType.PDF,
);
mockUpdatedContentEntity.id = '1';
mockUpdatedContentEntity.views = 0;
export const mockContentType = ContentType.VIDEO;
