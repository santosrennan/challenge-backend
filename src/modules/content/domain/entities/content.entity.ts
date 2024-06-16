import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ContentType } from '@common/enums/content-type.enum';

@ObjectType()
export class Content {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String)
  type: ContentType;

  @Field(() => Number)
  views: number;

  constructor(name: string, description: string, type: ContentType) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.views = 0;
  }
}
