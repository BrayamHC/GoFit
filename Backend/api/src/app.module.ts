import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from './database/knex.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ExtractorSubdominioMiddleware } from './middleware/extractor-subdominio.middleware';
import { throttlerConfig } from './config/throttler.config';

import { ClientesModule } from './modules/clientes/clientes.module';
import { MembresiasModule } from './modules/membresias/membresias.module';
import { SuscripcionesModule } from './modules/suscripciones/suscripciones.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { BitacoraModule } from './modules/bitacora/bitacora.module';
import { AsistenciasModule } from './modules/asistencias/asistencias.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule,
    AuthModule,
    ThrottlerModule.forRoot(throttlerConfig),
    // módulos gofit
    ClientesModule,
    MembresiasModule,
    SuscripcionesModule,
    UsuariosModule,
    BitacoraModule,
    AsistenciasModule
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
