import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';

import { SuscripcionesController } from './suscripciones.controller';
import { SuscripcionesService } from './suscripciones.service';
import { SuscripcionesBO } from './repositories/suscripciones.bo';
import { SuscripcionesRepoData } from './repositories/suscripciones.repoData';
import { SuscripcionesRepoAction } from './repositories/suscripciones.repoAction';

// MembresiasRepoData es necesario para calcular fecha_fin en crearSuscripcion
import { MembresiasRepoData } from '../membresias/repositories/membresias.repoData';

@Module({
    imports: [KnexModule],
    controllers: [SuscripcionesController],
    providers: [
        SuscripcionesService,
        SuscripcionesBO,
        SuscripcionesRepoData,
        SuscripcionesRepoAction,
        MembresiasRepoData,   // ← proveído aquí hasta que MembresiasModule exporte su repoData
    ],
    exports: [SuscripcionesService],  // ← ClientesModule lo importa
})
export class SuscripcionesModule { }
