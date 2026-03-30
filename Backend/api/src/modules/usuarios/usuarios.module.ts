import { Module } from '@nestjs/common';
import { KnexModule } from '../../database/knex.module';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UsuariosBO } from './repositories/usuarios.bo';
import { UsuariosRepoData } from './repositories/usuarios.repoData';
import { UsuariosRepoAction } from './repositories/usuarios.repoAction';
import { UsuariosRepoHelper } from './repositories/usuarios.repoHelper';
import { BitacoraModule } from '../bitacora/bitacora.module';



@Module({
    imports: [KnexModule, BitacoraModule],
    controllers: [UsuariosController],
    providers: [
        UsuariosService,
        UsuariosBO,
        UsuariosRepoData,
        UsuariosRepoAction,
        UsuariosRepoHelper,
    ],
    exports: [UsuariosService],
})
export class UsuariosModule { }
