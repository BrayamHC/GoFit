import { Knex } from 'knex';

export class SuscripcionesRepoHelper {

    static aplicarFiltros(query: Knex.QueryBuilder, filtros?: any) {
        if (!filtros) return;

        if (filtros.status) {
            query.where('s.status', filtros.status);
        }
        if (filtros.cliente_id) {
            query.where('s.cliente_id', filtros.cliente_id);
        }
        if (filtros.membresia_id) {
            query.where('s.membresia_id', filtros.membresia_id);
        }
        if (filtros.fecha_inicio_desde) {
            query.where('s.fecha_inicio', '>=', filtros.fecha_inicio_desde);
        }
        if (filtros.fecha_fin_hasta) {
            query.where('s.fecha_fin', '<=', filtros.fecha_fin_hasta);
        }
    }

    static aplicarOrden(query: Knex.QueryBuilder, filtros?: any) {
        const columnas = ['fecha_inicio', 'fecha_fin', 'fecha_creacion'];
        const orden    = ['asc', 'desc'];

        const col = columnas.includes(filtros?.order_by) ? filtros.order_by : 'fecha_creacion';
        const dir = orden.includes(filtros?.order_dir)   ? filtros.order_dir : 'desc';

        query.orderBy(`s.${col}`, dir);
    }
}
