import { Module } from '@nestjs/common';
import { AsistenciasCron } from './asistencias.cron';
import { SuscripcionesCron } from './suscripciones.cron';
import { AsistenciasModule } from '../modules/asistencias/asistencias.module';
import { SuscripcionesModule } from '../modules/suscripciones/suscripciones.module';
import { BitacoraModule } from '../modules/bitacora/bitacora.module';

@Module({
    imports: [AsistenciasModule, SuscripcionesModule, BitacoraModule],
    providers: [AsistenciasCron, SuscripcionesCron],
})
export class CronsModule { }