import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { FiltrosAsistencias } from '../dto/asistencias.validator';

@Injectable()
export class AsistenciasRepoHelper {
    aplicarFiltros(query: Knex.QueryBuilder, filtros: FiltrosAsistencias): void {
        if (filtros.cliente_id) {
            query.where('a.cliente_id', filtros.cliente_id);
        }
        if (filtros.status) {
            query.where('a.status', filtros.status);
        }
        if (filtros.metodo_acceso) {
            query.where('a.metodo_acceso', filtros.metodo_acceso);
        }
        if (filtros.fecha_desde) {
            query.where('a.fecha_entrada', '>=', `${filtros.fecha_desde} 00:00:00`);
        }
        if (filtros.fecha_hasta) {
            query.where('a.fecha_entrada', '<=', `${filtros.fecha_hasta} 23:59:59`);
        }
    }

    aplicarOrden(query: Knex.QueryBuilder, filtros: FiltrosAsistencias): void {
        if (filtros.sort) {
            const [campo, orden] = filtros.sort.split(':');
            query.orderBy(`a.${campo}`, orden ?? 'desc');
        } else {
            query.orderBy('a.fecha_entrada', 'desc');
        }
    }

    aplicarPaginacion(query: Knex.QueryBuilder, page: number, limit: number): void {
        const offset = (page - 1) * limit;
        query.limit(limit).offset(offset);
    }
}