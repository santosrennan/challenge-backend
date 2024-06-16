import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ContentType } from '@common/enums/content-type.enum';

@Entity()
@ObjectType()
export class ContentEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column({ type: 'enum', enum: ContentType })
  @Field(() => String)
  type: ContentType;

  @Column({ default: 0 })
  @Field(() => Number)
  views: number;

  constructor(name: string, description: string, type: ContentType) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.views = 0;
  }
}
