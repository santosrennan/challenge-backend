export class CreateContentDto {
  name: string;
  description: string;
  type: 'video' | 'pdf' | 'image';
}

export class UpdateContentDto {
  name?: string;
  description?: string;
  type?: 'video' | 'pdf' | 'image';
}
