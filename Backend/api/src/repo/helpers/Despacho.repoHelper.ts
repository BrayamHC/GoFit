import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class DespachoRepoHelper {

    aplicarFiltros(query: Knex.QueryBuilder, filtros: any,): void {

        if (!filtros) return;

        if (filtros.status) {
            query.where('d.status', filtros.status);
        }

        if (filtros.plan_id) {
            query.where('d.plan_id', filtros.plan_id);
        }

        if (filtros.razon_social) {
            query.whereILike('d.razon_social', `%${filtros.razon_social}%`);
        }
        if (filtros.email) {
            query.whereILike('ug.email', `%${filtros.email}%`);
        }
        if (filtros.subdominio) {
            query.where('d.subdominio', filtros.subdominio);
        }
        if (filtros.rfc) {
            query.where('d.rfc', filtros.rfc);
        }
        if (filtros.despacho_id) {
            query.where('d.despacho_id', filtros.despacho_id);
        }
    }
    aplicarFiltrosUsuariosGlobales(query: Knex.QueryBuilder, filtros: any): void {
        if (!filtros) return;

        if (filtros.status) {
            query.where('ug.status', filtros.status);
        }

        if (filtros.email) {
            query.where('ug.email', filtros.email);
        }

        if (filtros.email_like) {
            query.whereILike('ug.email', `%${filtros.email_like}%`);
        }

        if (filtros.nombre) {
            query.whereILike('ug.nombre', `%${filtros.nombre}%`);
        }

        if (filtros.usuario_id) {
            query.where('ug.usuario_id', filtros.usuario_id);
        }
        if (filtros.usuario_uuid) {
            query.where('ug.usuario_uuid', filtros.usuario_uuid);
        }
    }
    aplicarFiltrosPlanes(query: Knex.QueryBuilder, filtros: any): void {
        if (!filtros) return;

        if (filtros.status) {
            query.where('cp.status', filtros.status);
        }
        if (filtros.nombrePlan) {
            query.whereILike('cp.nombre_plan', `%${filtros.nombrePlan}%`);
        }
        if (filtros.plan_id) {
            query.where('cp.plan_id', filtros.plan_id);
        }
        if (filtros.plan_uuid) {
            query.where('cp.plan_uuid', filtros.plan_uuid);
        }
    }
    aplicarFiltrosBitacora(query: Knex.QueryBuilder, filtros: any): void {
        if (!filtros) return;

        if (filtros.modulo) {
            query.where('bg.modulo', filtros.modulo);
        }
        if (filtros.modulo_ids && Array.isArray(filtros.modulo_ids) && filtros.modulo_ids.length > 0) {
            query.whereIn('bg.modulo_id', filtros.modulo_ids);
        }
        if (filtros.modulo_id) {
            query.where('bg.modulo_id', filtros.modulo_id);
        }
        if (filtros.accion) {
            query.where('bg.accion', filtros.accion);
        }
        if (filtros.usuario_id) {
            query.where('bg.usuario_id', filtros.usuario_id);
        }
        if (filtros.fecha_desde) {
            query.where('bg.fecha', '>=', filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query.where('bg.fecha', '<=', filtros.fecha_hasta);
        }
    }
    aplicarFiltrosSuscripciones(query: Knex.QueryBuilder, filtros: any): void {
        if (!filtros) return;

        if (filtros.despacho_id) {
            query.where('s.despacho_id', filtros.despacho_id);
        }
        if (filtros.plan_id) {
            query.where('s.plan_id', filtros.plan_id);
        }
        if (filtros.status) {
            query.where('s.status', filtros.status);
        }
    }
}
