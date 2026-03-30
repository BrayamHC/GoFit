import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { FiltrosBitacora } from '../dto/bitacora.validator';

@Injectable()
export class BitacoraRepoHelper {
    aplicarFiltros(query: Knex.QueryBuilder, filtros?: FiltrosBitacora): void {
        if (!filtros) return;

        if (filtros.modulo) {
            query.where('b.modulo', filtros.modulo);
        }
        if (filtros.accion) {
            query.where('b.accion', filtros.accion);
        }
        if (filtros.usuario_id) {
            query.where('b.usuario_id', filtros.usuario_id);
        }
        if (filtros.fecha_desde) {
            query.where('b.fecha', '>=', filtros.fecha_desde);
        }
        if (filtros.fecha_hasta) {
            query.where('b.fecha', '<=', filtros.fecha_hasta);
        }
        if (filtros.sort) {
            const [campo, orden] = filtros.sort.split(':');
            query.orderBy(`b.${campo}`, orden ?? 'desc');
        }
    }
}