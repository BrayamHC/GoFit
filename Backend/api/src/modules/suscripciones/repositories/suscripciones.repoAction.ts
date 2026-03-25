import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class SuscripcionesRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async insertarSuscripcion(datos: any) {
        const [suscripcion] = await this.knex('suscripciones')
            .insert(datos)
            .returning(['*']);
        return suscripcion;
    }
}
