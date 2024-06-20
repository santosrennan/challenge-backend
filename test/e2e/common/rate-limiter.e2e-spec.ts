import axios from 'axios';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';

//rode com o banco e app no ar
describe('Rate Limiter (e2e)', () => {
  let app: INestApplication;
  const url = 'http://localhost:3000/graphql';
  const headers = {
    Authorization: 'student-token',
    UserId: '1',
  };
  const query = {
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
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return rate limit error after exceeding max requests', async () => {
    // Envia 110 requisições para exceder o limite de taxa
    for (let i = 0; i < 110; i++) {
      try {
        await axios.post(url, query, { headers });
      } catch (error) {
        // Verifica se o erro é devido ao limite de taxa
        expect(error.response.status).toEqual(429);
        expect(error.response.data).toEqual(
          'Too many requests from this IP, please try again later.',
        );
      }
    }

    // Tenta enviar mais uma requisição adicional após exceder o limite
    try {
      await axios.post(url, query, { headers });
      throw new Error(
        'Expected request to fail due to rate limit, but succeeded.',
      );
    } catch (error) {
      // Verifica se o erro é devido ao limite de taxa
      expect(error.response.status).toEqual(429);
      expect(error.response.data).toEqual(
        'Too many requests from this IP, please try again later.',
      );
    }
  });
});
