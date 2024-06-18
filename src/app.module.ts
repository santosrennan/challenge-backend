import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { ContentModule } from './modules/content/content.module';
import { AuthMiddleware } from '@common/auth/middleware/auth.middleware';
import { RateLimiterMiddleware } from '@common/rate-limiter/rate-limiter.middleware';
import { environment } from '@common/config/environment';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.typeorm.host,
      port: environment.typeorm.port,
      username: environment.typeorm.username,
      password: environment.typeorm.password,
      database: environment.typeorm.database,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      context: ({ req }) => ({ req }),
    }),
    ContentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('*')
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
