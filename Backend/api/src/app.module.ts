// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { GoFitModule } from './modules/gofit.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './database/knex.module';
import { AuthModule } from './modules/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ExtractorSubdominioMiddleware } from './middleware/extractor-subdominio.middleware';
import { throttlerConfig } from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule,
    AuthModule,
    ThrottlerModule.forRoot(throttlerConfig),
    GoFitModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractorSubdominioMiddleware)
      .forRoutes({ path: 'Auth/Login', method: RequestMethod.POST });

    consumer
      .apply(AuthMiddleware)
      .exclude(
        'Auth/Login',
        'Auth/LoginGlobal',
        'home-api',
      )
      .forRoutes('*');
  }
}
