import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ContentType } from '@common/enums/content-type.enum';

export class CreateContentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(ContentType)
  type: ContentType;
}

export class UpdateContentDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsEnum(ContentType)
  @IsOptional()
  type?: ContentType;
}
