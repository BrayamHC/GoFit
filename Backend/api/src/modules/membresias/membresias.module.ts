import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';

import { MembresiasController } from './membresias.controller';
import { MembresiasCoordinator } from './membresias.coordinator';
import { MembresiasService } from './membresias.service';
import { MembresiasBO } from './repositories/membresias.bo';
import { MembresiasRepoData } from './repositories/membresias.repoData';
import { MembresiasRepoAction } from './repositories/membresias.repoAction';
import { BitacoraModule } from '../bitacora/bitacora.module';


@Module({
    imports: [KnexModule, BitacoraModule],
    controllers: [MembresiasController],
    providers: [
        MembresiasCoordinator,
        MembresiasService,
        MembresiasBO,
        MembresiasRepoData,
        MembresiasRepoAction,
        // Shared — temporal

    ],
    exports: [MembresiasService, MembresiasRepoData], // ← RepoData exportado para SuscripcionesModule
})
export class MembresiasModule { }
