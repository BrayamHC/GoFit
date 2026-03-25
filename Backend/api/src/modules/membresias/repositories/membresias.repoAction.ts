import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class MembresiasRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async insertarMembresia(datos: any) {
        const [membresia] = await this.knex('membresias')
            .insert(datos)
            .returning('*');

        return {
            ...membresia,
            caracteristicas: typeof membresia.caracteristicas === 'string'
                ? JSON.parse(membresia.caracteristicas)
                : (membresia.caracteristicas ?? []),
        };
    }
}
