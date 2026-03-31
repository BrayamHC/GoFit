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

    async vencerExpiradas(hoy: string): Promise<number> {
        const actualizadas = await this.knex('suscripciones')
            .where('status', 'vigente')
            .where('fecha_fin', '<', hoy)
            .update({
                status: 'vencida',
                fecha_actualizacion: this.knex.fn.now(),
            });
        return actualizadas;
    }
}
