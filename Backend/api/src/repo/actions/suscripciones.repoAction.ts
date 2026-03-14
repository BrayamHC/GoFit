import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class SuscripcionesRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async insertarSuscripcion(datos: any) {
        const [suscripcion] = await this.knex('suscripciones')
            .insert(datos)
            .returning([
                'suscripcion_id',
                'suscripcion_uuid',
                'cliente_id',
                'membresia_id',
                'fecha_inicio',
                'fecha_fin',
                'status',
            ]);
        return suscripcion;
    }
}
