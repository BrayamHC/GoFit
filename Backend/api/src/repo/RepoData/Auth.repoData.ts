import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AuthRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async obtenerUsuarioPorEmail(email: string) {
        try {
            return await this.knex('usuarios as u')
                .select(
                    'u.usuario_id',
                    'u.usuario_uuid',
                    'u.nombre',
                    'u.apellido',
                    'u.email',
                    'u.password',
                    'u.status',
                )
                .where('u.email', email)
                .where('u.status', 'activo')
                .first();
        } catch (error) {
            console.error('Error obteniendo usuario por email:', error);
            return null;
        }
    }

    async obtenerUsuarioPorId(usuarioId: number) {
        try {
            return await this.knex('usuarios as u')
                .select(
                    'u.usuario_id',
                    'u.nombre',
                    'u.apellido',
                    'u.email',
                    'u.status',
                )
                .where('u.usuario_id', usuarioId)
                .where('u.status', 'activo')
                .first();
        } catch (error) {
            console.error('Error obteniendo usuario por id:', error);
            return null;
        }
    }
}
