import { Knex } from 'knex';

export class UsuariosRepoHelper {
    static aplicarFiltros(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        if (!filtros) return query;

        if (filtros.status) query.where('u.status', filtros.status);
        if (filtros.email) query.whereILike('u.email', `%${filtros.email}%`);
        if (filtros.nombre) query.whereILike('u.nombre', `%${filtros.nombre}%`);
        if (filtros.apellido) query.whereILike('u.apellido', `%${filtros.apellido}%`);

        return query;
    }

    static aplicarOrden(query: Knex.QueryBuilder, filtros: any): Knex.QueryBuilder {
        const columnasPermitidas = ['nombre', 'apellido', 'email', 'fecha_creacion'];
        const direccionesPermitidas = ['asc', 'desc'];

        const columna = columnasPermitidas.includes(filtros?.sort) ? filtros.sort : 'fecha_creacion';
        const direccion = direccionesPermitidas.includes(filtros?.dir) ? filtros.dir : 'desc';

        return query.orderBy(`u.${columna}`, direccion);
    }
}
