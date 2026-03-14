import { Knex } from 'knex';

export class MembresiasRepoHelper {
    static aplicarFiltros(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        if (!filtros) return query;

        if (filtros.status) {
            query.where('m.status', filtros.status);
        }

        if (filtros.nombre) {
            query.whereILike('m.nombre', `%${filtros.nombre}%`);
        }

        if (filtros.moneda) {
            query.where('m.moneda', filtros.moneda);
        }

        if (filtros.precio_min) {
            query.where('m.precio', '>=', Number(filtros.precio_min));
        }

        if (filtros.precio_max) {
            query.where('m.precio', '<=', Number(filtros.precio_max));
        }

        if (filtros.dias_duracion) {
            query.where('m.dias_duracion', Number(filtros.dias_duracion));
        }

        return query;
    }

    static aplicarOrden(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        const columnasPermitidas = ['nombre', 'precio', 'dias_duracion', 'fecha_creacion'];
        const direccionesPermitidas = ['asc', 'desc'];

        const columna   = columnasPermitidas.includes(filtros?.sort)  ? filtros.sort  : 'fecha_creacion';
        const direccion = direccionesPermitidas.includes(filtros?.dir) ? filtros.dir   : 'desc';

        return query.orderBy(`m.${columna}`, direccion);
    }
}
