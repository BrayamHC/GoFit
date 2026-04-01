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
import { ScheduleModule } from '@nestjs/schedule';
import { CronsModule } from './crons/crons.module';
import { RegistrosFacialesModule } from './modules/registros-faciales/registros-faciales.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    KnexModule,
    AuthModule,
    ThrottlerModule.forRoot(throttlerConfig),
    ScheduleModule.forRoot(),
    CronsModule,
    // módulos gofit
    ClientesModule,
    MembresiasModule,
    SuscripcionesModule,
    UsuariosModule,
    BitacoraModule,
    AsistenciasModule,
    RegistrosFacialesModule
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
        // Excluido del token — protegido por VisionGuard (x-vision-key)
        'registros-faciales/encodings',
      )
      .forRoutes('*');
  }
}
