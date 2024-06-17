import { Content } from '@domain/entities/content.entity';
import { ContentView } from '@domain/entities/content-view.entity';

export interface ContentRepository {
  save(content: Content): Promise<Content>;
  findById(id: string): Promise<Content | null>;
  findAll(): Promise<Content[]>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
  hasViewedContent(contentId: string, userId: string): Promise<boolean>;
  saveContentView(contentView: ContentView): Promise<void>;
}
