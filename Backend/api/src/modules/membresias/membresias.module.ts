import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';

import { MembresiasController } from './membresias.controller';
import { MembresiasCoordinator } from './membresias.coordinator';
import { MembresiasService } from './membresias.service';
import { MembresiasBO } from './repositories/membresias.bo';
import { MembresiasRepoData } from './repositories/membresias.repoData';
import { MembresiasRepoAction } from './repositories/membresias.repoAction';

// Shared — temporal hasta crear BitacoraModule
import { BitacoraService } from '../../services/bitacora.service';
import { BitacoraRepoAction } from '../../repo/actions/bitacora.repoAction';
import { BitacoraBO } from '../../repo/BO/bitacora.bo';

@Module({
    imports: [KnexModule],
    controllers: [MembresiasController],
    providers: [
        MembresiasCoordinator,
        MembresiasService,
        MembresiasBO,
        MembresiasRepoData,
        MembresiasRepoAction,
        // Shared — temporal
        BitacoraService,
        BitacoraRepoAction,
        BitacoraBO,
    ],
    exports: [MembresiasService, MembresiasRepoData], // ← RepoData exportado para SuscripcionesModule
})
export class MembresiasModule { }
