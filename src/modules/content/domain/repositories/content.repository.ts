import { Content } from '@domain/entities/content.entity';

export interface ContentRepository {
  save(content: Content): Promise<Content>;
  findById(id: string): Promise<Content | null>;
  findAll(): Promise<Content[]>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
}
