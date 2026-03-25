import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { UsuariosRepoHelper } from './usuarios.repoHelper';

@Injectable()
export class UsuariosRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async obtenerUsuarios(filtros?: any) {
        try {
            const query = this.knex('usuarios as u').select(
                'u.usuario_id',
                'u.usuario_uuid',
                'u.nombre',
                'u.apellido',
                'u.email',
                'u.status',
                'u.fecha_ultimo_acceso',
                'u.fecha_creacion',
                'u.fecha_actualizacion',
            );
            UsuariosRepoHelper.aplicarFiltros(query, filtros);
            UsuariosRepoHelper.aplicarOrden(query, filtros);
            return await query;
        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            throw error;
        }
    }

    async obtenerUsuarioPorUuid(uuid: string) {
        try {
            return await this.knex('usuarios as u').select(
                'u.usuario_id',
                'u.usuario_uuid',
                'u.nombre',
                'u.apellido',
                'u.email',
                'u.status',
                'u.fecha_ultimo_acceso',
                'u.fecha_creacion',
                'u.fecha_actualizacion',
            )
                .where('u.usuario_uuid', uuid)
                .first();
        } catch (error) {
            console.error('Error obteniendo usuario por uuid:', error);
            throw error;
        }
    }

    async obtenerTotalUsuarios(filtros?: any) {
        try {
            const query = this.knex('usuarios as u').count('u.usuario_id as total');
            UsuariosRepoHelper.aplicarFiltros(query, filtros);
            const resultado = await query.first();
            return Number(resultado?.total ?? 0);
        } catch (error) {
            console.error('Error obteniendo total usuarios:', error);
            throw error;
        }
    }
}
