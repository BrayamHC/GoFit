import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';

import { SuscripcionesController } from './suscripciones.controller';
import { SuscripcionesService } from './suscripciones.service';
import { SuscripcionesBO } from './repositories/suscripciones.bo';
import { SuscripcionesRepoData } from './repositories/suscripciones.repoData';
import { SuscripcionesRepoAction } from './repositories/suscripciones.repoAction';

// MembresiasRepoData es necesario para calcular fecha_fin en crearSuscripcion
import { MembresiasRepoData } from '../membresias/repositories/membresias.repoData';
import { BitacoraModule } from '../bitacora/bitacora.module';

@Module({
    imports: [KnexModule, BitacoraModule],
    controllers: [SuscripcionesController],
    providers: [
        SuscripcionesService,
        SuscripcionesBO,
        SuscripcionesRepoData,
        SuscripcionesRepoAction,
        MembresiasRepoData,   // ← proveído aquí hasta que MembresiasModule exporte su repoData
    ],
    exports: [SuscripcionesService, SuscripcionesRepoAction]
})
export class SuscripcionesModule { }
