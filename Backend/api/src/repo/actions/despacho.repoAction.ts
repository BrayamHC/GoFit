// src/repo/actions/despacho.repoAction.ts
import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class DespachoRepoAction {
    constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) { }

    async insertarDespacho(datos: any, trx?: Knex.Transaction) {
        const query = trx ? trx('despachos') : this.knex('despachos');
        const [despachoCreado] = await query.insert(datos).returning('*');
        return despachoCreado;
    }


    async eliminarDespacho(despachoId: number, usuarioEliminacion: number) {
        const [despachoEliminado] = await this.knex('despachos')
            .where('despacho_id', despachoId)
            .whereNot('status', 'eliminado')
            .update({
                status: 'eliminado',
                fecha_actualizacion: new Date(),
                usuario_actualizacion: usuarioEliminacion,
            })
            .returning('*');

        return despachoEliminado;
    }

    async insertarUsuarioAdminTenant(datos: any, knexTenant: Knex) {
        const [usuarioCreado] = await knexTenant('usuarios')
            .insert(datos)
            .returning('*');

        return usuarioCreado;
    }

    async insertarUsuarioGlobal(datos: any) {
        const [usuarioGlobalCreado] = await this.knex('usuarios_globales')
            .insert(datos)
            .returning('*');
        return usuarioGlobalCreado;
    }

    async insertarSuscripcion(datos: any, trx?: Knex.Transaction) {
        try {
            const query = trx ? trx('suscripciones') : this.knex('suscripciones');

            const [suscripcion] = await query
                .insert(datos)
                .returning('*');

            return suscripcion;

        } catch (error) {
            throw error;

        }
    }
    async insertarBitacoraGlobal(datos: any, trx?: Knex.Transaction) {
        try {
            const query = trx ? trx('bitacora_global') : this.knex('bitacora_global');

            const [bitacora] = await query
                .insert(datos)
                .returning('*');

            return bitacora;

        } catch (error) {
            throw error;
        }
    }

    async actualizarDespacho(despachoId: number, datos: any, trx: Knex.Transaction) {
        const [despachoActualizado] = await trx('despachos')
            .where('despacho_id', despachoId)
            .whereNot('status', 'eliminado')
            .update(datos)
            .returning('*');

        return despachoActualizado;
    }

    async actualizarUsuarioAdminTenant(datos: any, emailActual: string, knexTenant: Knex) {
        const [usuarioActualizado] = await knexTenant('usuarios')
            .where('email', emailActual)
            .where('rol_id', 1)
            .update(datos)
            .returning(['usuario_id', 'nombre_completo', 'email', 'telefono', 'direccion']);

        return usuarioActualizado;
    }

    async actualizarSuscripcionActiva(despachoId: number, datos: any, trx: Knex.Transaction) {
        const [suscripcionActualizada] = await trx('suscripciones')
            .where('despacho_id', despachoId)
            .where('status', 'activo')
            .update(datos)
            .returning('*');

        return suscripcionActualizada;
    }

    async insertarPlan(datos: any) {
        const [planCreado] = await this.knex('cat_planes')
            .insert(datos)
            .returning('*');
        return planCreado;
    }

}
