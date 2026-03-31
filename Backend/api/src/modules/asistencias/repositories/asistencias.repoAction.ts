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

    async marcarNoCerradas(fecha: string): Promise<number> {
        const actualizadas = await this.knex('asistencias')
            .where('status', 'activa')
            .where('fecha_entrada', '>=', `${fecha} 00:00:00`)
            .where('fecha_entrada', '<=', `${fecha} 23:59:59`)
            .update({ status: 'no_cerrada' });
        return actualizadas; // retorna cantidad de filas afectadas
    }
}