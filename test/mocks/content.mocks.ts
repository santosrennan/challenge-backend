// test/mocks/content.mocks.ts

import { Content } from '@domain/entities/content.entity';
import {
  CreateContentDto,
  UpdateContentDto,
} from '@application/dtos/content.dto';
import { UserRole } from '@common/auth/roles.enum';
import { ContentType } from '@common/enums/content-type.enum';

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
};

export const mockUserId = 'user1';
export const mockUserRoleStudent = UserRole.STUDENT;
export const mockUserRoleAdmin = UserRole.ADMIN;
