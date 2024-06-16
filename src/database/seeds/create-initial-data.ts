import { DataSource } from 'typeorm';
import { ContentEntity } from '@infrastructure/persistence/typeorm/content.entity';
import { ContentType } from '@common/enums/content-type.enum';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [ContentEntity],
});

async function runSeed() {
  await AppDataSource.initialize();

  const contentRepository = AppDataSource.getRepository(ContentEntity);

  const contents = [
    {
      name: 'Video 1',
      description: 'Descrição do Video 1',
      type: ContentType.VIDEO,
      views: 0,
    },
    {
      name: 'PDF 1',
      description: 'Descrição do PDF 1',
      type: ContentType.PDF,
      views: 0,
    },
    {
      name: 'Imagem 1',
      description: 'Descrição da Imagem 1',
      type: ContentType.IMAGE,
      views: 0,
    },
  ];

  for (const content of contents) {
    const newContent = contentRepository.create(content);
    await contentRepository.save(newContent);
  }

  console.log('Dados de seed inseridos com sucesso!');
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('Erro ao rodar o seed: ', error);
  process.exit(1);
});
