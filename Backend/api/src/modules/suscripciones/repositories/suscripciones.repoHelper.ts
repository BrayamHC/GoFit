import { Knex } from 'knex';

export class SuscripcionesRepoHelper {
    static aplicarFiltros(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        if (!filtros) return query;

        if (filtros.cliente_id) query.where('s.cliente_id', filtros.cliente_id);
        if (filtros.membresia_id) query.where('s.membresia_id', filtros.membresia_id);
        if (filtros.status) query.where('s.status', filtros.status);

        return query;
    }

    static aplicarOrden(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        const columnasPermitidas = ['fecha_inicio', 'fecha_fin', 'fecha_creacion'];
        const direccionesPermitidas = ['asc', 'desc'];

        const columna = columnasPermitidas.includes(filtros?.sort) ? filtros.sort : 'fecha_creacion';
        const direccion = direccionesPermitidas.includes(filtros?.dir) ? filtros.dir : 'desc';

        return query.orderBy(`s.${columna}`, direccion);
    }
}
