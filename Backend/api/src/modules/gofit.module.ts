import { Module } from '@nestjs/common';
import { KnexModule } from '../database/knex.module';

// Controllers
import { ClientesController }   from '../controllers/clientes.controller';
import { MembresiasController } from '../controllers/membresias.controller';

// Coordinators
import { ClientesCoordinator }   from '../coordinators/clientes.coordinator';
import { MembresiasCoordinator } from '../coordinators/membresias.coordinator';

// Services
import { ClientesService }      from '../services/clientes.service';
import { MembresiasService }    from '../services/membresias.service';
import { SuscripcionesService } from '../services/suscripciones.service';
import { BitacoraService }      from '../services/bitacora.service';

// RepoData
import { ClientesRepoData }   from '../repo/RepoData/clientes.repoData';
import { MembresiasRepoData } from '../repo/RepoData/membresias.repoData';

// RepoAction
import { ClientesRepoAction }      from '../repo/actions/clientes.repoAction';
import { MembresiasRepoAction }    from '../repo/actions/membresias.repoAction';
import { SuscripcionesRepoAction } from '../repo/actions/suscripciones.repoAction';
import { BitacoraRepoAction }      from '../repo/actions/bitacora.repoAction';

// BO
import { ClientesBO }      from '../repo/BO/clientes.bo';
import { MembresiasBO }    from '../repo/BO/membresias.bo';
import { SuscripcionesBO } from '../repo/BO/suscripciones.bo';
import { BitacoraBO }      from '../repo/BO/bitacora.bo';

@Module({
    imports: [KnexModule],
    controllers: [
        ClientesController,
        MembresiasController,
    ],
    providers: [
        // Coordinators
        ClientesCoordinator,
        MembresiasCoordinator,
        // Services
        ClientesService,
        MembresiasService,
        SuscripcionesService,
        BitacoraService,
        // RepoData
        ClientesRepoData,
        MembresiasRepoData,
        // RepoAction
        ClientesRepoAction,
        MembresiasRepoAction,
        SuscripcionesRepoAction,
        BitacoraRepoAction,
        // BO
        ClientesBO,
        MembresiasBO,
        SuscripcionesBO,
        BitacoraBO,
    ],
})
export class GoFitModule {}
