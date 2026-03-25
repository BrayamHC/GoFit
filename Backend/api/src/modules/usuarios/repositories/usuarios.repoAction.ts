import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class UsuariosRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async insertarUsuario(datos: any) {
        const [usuario] = await this.knex('usuarios')
            .insert(datos)
            .returning([
                'usuario_id', 'usuario_uuid',
                'nombre', 'apellido',
                'email', 'status',
                'fecha_creacion',
            ]);
        return usuario;
    }

    async actualizarUsuario(uuid: string, datos: any) {
        const [usuario] = await this.knex('usuarios')
            .where('usuario_uuid', uuid)
            .update(datos)
            .returning([
                'usuario_id', 'usuario_uuid',
                'nombre', 'apellido',
                'email', 'status',
                'fecha_actualizacion',
            ]);
        return usuario;
    }
}
