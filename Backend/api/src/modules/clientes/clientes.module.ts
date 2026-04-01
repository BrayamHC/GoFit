import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';
import { SuscripcionesModule } from '../suscripciones/suscripciones.module';
import { RegistrosFacialesModule } from '../registros-faciales/registros-faciales.module';

import { ClientesController } from './clientes.controller';
import { ClientesCoordinator } from './clientes.coordinator';
import { ClientesService } from './clientes.service';
import { ClientesBO } from './repositories/clientes.bo';
import { ClientesRepoData } from './repositories/clientes.repoData';
import { ClientesRepoAction } from './repositories/clientes.repoAction';

import { BitacoraModule } from '../bitacora/bitacora.module';


@Module({
    imports: [KnexModule, SuscripcionesModule, BitacoraModule, RegistrosFacialesModule],
    controllers: [ClientesController],
    providers: [
        ClientesCoordinator,
        ClientesService,
        ClientesBO,
        ClientesRepoData,
        ClientesRepoAction,
    ],
    exports: [ClientesService],
})
export class ClientesModule { }
