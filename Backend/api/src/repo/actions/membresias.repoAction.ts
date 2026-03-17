import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class MembresiasRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async insertarMembresia(datos: any) {
        try {
            const [membresia_id] = await this.knex('membresias')
                .insert(datos)
                .returning('membresia_id');  // ← PostgreSQL necesita returning()

            const row = await this.knex('membresias')
                .where('membresia_id', membresia_id)
                .first();

            return {
                ...row,
                caracteristicas: typeof row.caracteristicas === 'string'
                    ? JSON.parse(row.caracteristicas)
                    : (row.caracteristicas ?? []),
            };
        } catch (error) {
            console.error('Error insertando membresia:', error);
            throw error;
        }
    }
}
