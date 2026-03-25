import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';
import { SuscripcionesModule } from '../suscripciones/suscripciones.module';

import { ClientesController } from './clientes.controller';
import { ClientesCoordinator } from './clientes.coordinator';
import { ClientesService } from './clientes.service';
import { ClientesBO } from './repositories/clientes.bo';
import { ClientesRepoData } from './repositories/clientes.repoData';
import { ClientesRepoAction } from './repositories/clientes.repoAction';

// Shared — temporal hasta mover a su propio módulo
import { BitacoraService } from '../../services/bitacora.service';
import { BitacoraRepoAction } from '../../repo/actions/bitacora.repoAction';
import { BitacoraBO } from '../../repo/BO/bitacora.bo';

@Module({
    imports: [KnexModule, SuscripcionesModule],
    controllers: [ClientesController],
    providers: [
        ClientesCoordinator,
        ClientesService,
        ClientesBO,
        ClientesRepoData,
        ClientesRepoAction,
        // Shared — se moverán cuando creemos BitacoraModule
        BitacoraService,
        BitacoraRepoAction,
        BitacoraBO,
    ],
    exports: [ClientesService],
})
export class ClientesModule { }
