import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosBO } from './repositories/usuarios.bo';
import { UsuariosRepoData } from './repositories/usuarios.repoData';
import { UsuariosRepoAction } from './repositories/usuarios.repoAction';
import { UsuariosRepoHelper } from './repositories/usuarios.repoHelper';

// Shared — temporal hasta crear BitacoraModule
import { BitacoraService } from '../../services/bitacora.service';
import { BitacoraRepoAction } from '../../repo/actions/bitacora.repoAction';
import { BitacoraBO } from '../../repo/BO/bitacora.bo';

@Module({
    imports: [KnexModule],
    controllers: [UsuariosController],
    providers: [
        UsuariosService,
        UsuariosBO,
        UsuariosRepoData,
        UsuariosRepoAction,
        UsuariosRepoHelper,
        // Shared — temporal
        BitacoraService,
        BitacoraRepoAction,
        BitacoraBO,
    ],
    exports: [UsuariosService],
})
export class UsuariosModule { }
