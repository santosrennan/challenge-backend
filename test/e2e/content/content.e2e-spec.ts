import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import {
  mockCreateContentDto,
  mockUpdateContentDto,
  mockUserId,
} from '../../mocks/content.mocks';
import { ContentType } from '@common/enums/content-type.enum';

describe('ContentService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create content', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createContent(
              name: "${mockCreateContentDto.name}",
              description: "${mockCreateContentDto.description}",
              type: "${mockCreateContentDto.type}"
            ) {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);

    expect(response.body.data.createContent).toMatchObject({
      name: mockCreateContentDto.name,
      description: mockCreateContentDto.description,
      type: ContentType.VIDEO,
    });
  });

  it('should find all contents', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            contents {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'student-token')
      .set('UserId', mockUserId);

    expect(response.body.data.contents).toBeInstanceOf(Array);
  });

  it('should find one content and increment views for students', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createContent(
              name: "${mockCreateContentDto.name}",
              description: "${mockCreateContentDto.description}",
              type: "${mockCreateContentDto.type}"
            ) {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);

    const contentId = createResponse.body.data.createContent.id;

    // Primeira consulta para verificar views antes do incremento
    const findResponseBefore = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            content(id: "${contentId}") {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'student-token')
      .set('UserId', mockUserId);

    // Verificar que as visualizações começam em 0 na primeira consulta do estudante
    expect(findResponseBefore.body.data.content.views).toBe(0);

    // Segunda consulta para verificar views após o incremento da primeira consulta
    const findResponseAfter = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            content(id: "${contentId}") {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'student-token')
      .set('UserId', mockUserId);

    // Verificar que as visualizações foram incrementadas para 1
    expect(findResponseAfter.body.data.content.views).toBe(1);
  });

  it('should update content', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createContent(
              name: "${mockCreateContentDto.name}",
              description: "${mockCreateContentDto.description}",
              type: "${mockCreateContentDto.type}"
            ) {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);

    const contentId = createResponse.body.data.createContent.id;

    const updateResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateContent(
              id: "${contentId}",
              name: "${mockUpdateContentDto.name}"
            ) {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);
    expect(updateResponse.body.data.updateContent.name).toBe(
      mockUpdateContentDto.name,
    );
  });

  it('should delete content', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createContent(
              name: "${mockCreateContentDto.name}",
              description: "${mockCreateContentDto.description}",
              type: "${mockCreateContentDto.type}"
            ) {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);

    const contentId = createResponse.body.data.createContent.id;

    const deleteResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            deleteContent(id: "${contentId}")
          }
        `,
      })
      .set('Authorization', 'admin-token')
      .set('UserId', mockUserId);

    expect(deleteResponse.body.data.deleteContent).toBe(true);

    const findResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            content(id: "${contentId}") {
              id
              name
              description
              type
              views
            }
          }
        `,
      })
      .set('Authorization', 'student-token')
      .set('UserId', mockUserId);

    expect(findResponse.body.data.content).toBeNull();
  });
});
