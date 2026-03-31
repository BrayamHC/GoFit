import { Module } from '@nestjs/common';
import { AsistenciasController } from './asistencias.controller';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasCoordinator } from './asistencias.coordinator';
import { AsistenciasRepoData } from './repositories/asistencias.repoData';
import { AsistenciasRepoAction } from './repositories/asistencias.repoAction';
import { AsistenciasRepoHelper } from './repositories/asistencias.repoHelper';
import { AsistenciasBO } from './repositories/asistencias.bo';
import { ClientesModule } from '../clientes/clientes.module';
import { SuscripcionesModule } from '../suscripciones/suscripciones.module';
import { BitacoraModule } from '../bitacora/bitacora.module';

@Module({
    imports: [ClientesModule, SuscripcionesModule, BitacoraModule],
    controllers: [AsistenciasController],
    providers: [
        AsistenciasService,
        AsistenciasCoordinator,
        AsistenciasRepoData,
        AsistenciasRepoAction,
        AsistenciasRepoHelper,
        AsistenciasBO,
    ],
})
export class AsistenciasModule { }