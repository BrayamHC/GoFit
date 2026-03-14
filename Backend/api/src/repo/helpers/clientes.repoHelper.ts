import { Knex } from 'knex';

export class ClientesRepoHelper {
    static aplicarFiltros(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        if (!filtros) return query;

        if (filtros.status) {
            query.where('c.status', filtros.status);
        }

        if (filtros.nombre) {
            query.whereILike('c.nombre', `%${filtros.nombre}%`);
        }

        if (filtros.apellido) {
            query.whereILike('c.apellido', `%${filtros.apellido}%`);
        }

        if (filtros.email) {
            query.whereILike('c.email', `%${filtros.email}%`);
        }

        if (filtros.telefono) {
            query.where('c.telefono', filtros.telefono);
        }

        return query;
    }

    static aplicarOrden(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        const columnasPermitidas = ['nombre', 'apellido', 'email', 'fecha_creacion'];
        const direccionesPermitidas = ['asc', 'desc'];

        const columna   = columnasPermitidas.includes(filtros?.sort)  ? filtros.sort      : 'fecha_creacion';
        const direccion = direccionesPermitidas.includes(filtros?.dir) ? filtros.dir       : 'desc';

        return query.orderBy(`c.${columna}`, direccion);
    }
}
