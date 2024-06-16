import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

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

  @Column({ type: 'enum', enum: ['video', 'pdf', 'image'] })
  @Field(() => String)
  type: 'video' | 'pdf' | 'image';

  @Column({ default: 0 })
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
