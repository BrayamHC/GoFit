import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { AsistenciasRepoHelper } from './asistencias.repoHelper';
import { FiltrosAsistencias } from '../dto/asistencias.validator';

@Injectable()
export class AsistenciasRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
        private readonly helper: AsistenciasRepoHelper,
    ) { }

    async obtenerAsistencias(filtros?: FiltrosAsistencias) {
        try {
            const hoy = new Date().toISOString().split('T')[0];

            const filtrosEfectivos: FiltrosAsistencias = {
                ...filtros,
                fecha_desde: filtros?.fecha_desde ?? hoy,
                fecha_hasta: filtros?.fecha_hasta ?? hoy,
                page: filtros?.page ?? 1,
                limit: filtros?.limit ?? 20,
            };

            // Query de datos
            const query = this.knex('asistencias as a').select(
                'a.asistencia_uuid',
                'a.nombre_cliente',
                'a.fecha_entrada',
                'a.fecha_salida',
                'a.duracion_minutos',
                'a.status',
                'a.metodo_acceso',
                'a.dias_restantes_suscripcion',
                'a.membresia_nombre',
                'a.total_accesos',
                'a.fecha_creacion',
                'a.usuario_creacion',
            );
            this.helper.aplicarFiltros(query, filtrosEfectivos);
            this.helper.aplicarOrden(query, filtrosEfectivos);
            this.helper.aplicarPaginacion(query, filtrosEfectivos.page, filtrosEfectivos.limit);

            // Query de conteo — mismos filtros, sin paginación ni orden
            const queryCount = this.knex('asistencias as a').count('a.asistencia_id as total');
            this.helper.aplicarFiltros(queryCount, filtrosEfectivos);

            const [asistencias, [{ total }]] = await Promise.all([query, queryCount]);

            return { asistencias, total: Number(total) };
        } catch (error) {
            console.error('Error obteniendo asistencias:', error);
            throw error;
        }
    }

    async contarAccesosPorCliente(clienteId: number): Promise<number> {
        const [{ count }] = await this.knex('asistencias')
            .where('cliente_id', clienteId)
            .count('asistencia_id as count');
        return Number(count);
    }

    async obtenerAsistenciaActivaHoy(clienteId: number) {
        try {
            const hoy = new Date().toISOString().split('T')[0];
            return await this.knex('asistencias as a')
                .select(
                    'a.asistencia_id',
                    'a.asistencia_uuid',
                    'a.cliente_id',
                    'a.nombre_cliente',
                    'a.fecha_entrada',
                    'a.status',
                )
                .where('a.cliente_id', clienteId)
                .where('a.status', 'activa')
                .where('a.fecha_entrada', '>=', `${hoy} 00:00:00`)
                .where('a.fecha_entrada', '<=', `${hoy} 23:59:59`)
                .first();
        } catch (error) {
            console.error('Error obteniendo asistencia activa de hoy:', error);
            throw error;
        }
    }
}