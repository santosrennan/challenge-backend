import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Content {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String)
  type: 'video' | 'pdf' | 'image';

  @Field(() => Number)
  views: number;

  constructor(
    name: string,
    description: string,
    type: 'video' | 'pdf' | 'image',
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.views = 0;
  }
}
