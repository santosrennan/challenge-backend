import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ContentService } from '@application/services/content.service';
import { Content } from '@domain/entities/content.entity';
import { UseGuards } from '@nestjs/common';
import { Roles } from '@common/auth/decorators/roles.decorator';
import { RolesGuard } from '@common/auth/guards/roles.guard';
import { UserRole } from '@common/auth/roles.enum';
import { ContentType } from '@common/enums/content-type.enum';
import {
  CreateContentDto,
  UpdateContentDto,
} from '../../application/dtos/content.dto';

@UseGuards(RolesGuard)
@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [Content])
  contents() {
    return this.contentService.findAll();
  }

  @Query(() => Content, { nullable: true })
  content(@Args('id') id: string, @Context('req') req) {
    const userRole = req.user?.role;
    const userId = req.user?.id;
    return this.contentService.findOne(id, userRole, userId);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Content)
  createContent(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('type') type: ContentType,
    @Context('req') req,
  ) {
    const userRole = req.user?.role;
    const createContentDto: CreateContentDto = { name, description, type };
    return this.contentService.create(createContentDto);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Content, { nullable: true })
  updateContent(
    @Context('req') req,
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('type', { nullable: true }) type?: ContentType,
  ) {
    const userRole = req.user?.role;
    const updateContentDto: UpdateContentDto = { name, description, type };
    return this.contentService.update(id, updateContentDto);
  }

  @Roles(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: string, @Context('req') req) {
    const userRole = req.user?.role;
    await this.contentService.delete(id);
    return true;
  }
}
