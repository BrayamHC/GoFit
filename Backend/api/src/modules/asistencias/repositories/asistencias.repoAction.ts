import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AsistenciasRepoAction {
    constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) { }

    async insertarAsistencia(datos: Record<string, unknown>) {
        const [asistencia] = await this.knex('asistencias').insert(datos).returning('*');
        return asistencia;
    }

    async cerrarAsistencia(asistencia: any, cierre: { fecha_salida: Date; duracion_minutos: number; status: 'completada' }) {
        const [asistenciaCerrada] = await this.knex('asistencias')
            .where('asistencia_id', asistencia.asistencia_id)
            .update(cierre)
            .returning('*');
        return asistenciaCerrada;
    }
}