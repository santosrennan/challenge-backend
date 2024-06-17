import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';

@Entity()
export class ContentViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ContentEntity, (content) => content.views)
  content: ContentEntity;

  @Column()
  userId: string;
}
