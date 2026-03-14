import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { DespachoRepoHelper } from '../helpers/Despacho.repoHelper';

@Injectable()
export class DespachoRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
        private readonly despachoRepoHelper: DespachoRepoHelper,
    ) { }
    async obtenerDespachos(filtros?: any) {
        try {
            let query = this.knex('despachos as d')
                .select(
                    'd.despacho_id',
                    'd.despacho_uuid',
                    'd.razon_social',
                    'd.subdominio',
                    'd.nombre_comercial',
                    'd.rfc',
                    'd.nota',
                    'd.status',
                    'd.fecha_creacion',
                    'd.fecha_actualizacion',
                    'd.usuario_actualizacion',
                    'd.usuario_nombre as admin_despacho',
                    'd.usuario_email as email_admin',
                    'd.usuario_telefono as telefono_admin',
                    'd.usuario_direccion as direccion_admin',
                    'cp.nombre_plan as plan_asociado',
                    'cp.limite_usuarios as usuarios_plan',
                    'zh.descripcion as zona_horaria',
                    'us.nombre as usuario_creacion'
                )
                .leftJoin('cat_planes as cp', 'd.plan_id', 'cp.plan_id')
                .leftJoin('cat_zonas_horarias as zh', 'd.zona_id', 'zh.zona_id')
                .leftJoin('usuarios_globales as us', 'd.usuario_creacion', 'us.usuario_id')
                .orderBy('d.despacho_id', 'asc');

            this.despachoRepoHelper.aplicarFiltros(query, filtros);
            return await query;

        } catch (error) {
            console.error("Error en repo:", error);
            return null;
        }
    }


    async obtenerZonasHorarias() {
        try {
            let query = this.knex('cat_zonas_horarias as zh')
                .select(
                    'zh.zona_id',
                    'zh.nombre',
                    'zh.descripcion',
                    'zh.utc_offset',
                );
            return await query;
        } catch (error) {
            console.error("Error en repo:", error);
            return null;
        }
    }

    async obtenerUsuariosGlobales(filtros?: any) {
        try {
            let query = this.knex('usuarios_globales as ug')
                .select(
                    'ug.usuario_id',
                    'ug.usuario_uuid',
                    'ug.nombre',
                    'ug.email',
                    'ug.fecha_creacion',
                )
                .orderBy('ug.fecha_creacion', 'asc');

            this.despachoRepoHelper.aplicarFiltrosUsuariosGlobales(query, filtros);
            return await query;
        } catch (error) {
            console.error("Error en repo:", error);
            return null;
        }
    }

    async obtenerPlanes(filtros?: any) {
        try {
            let query = this.knex('cat_planes as cp')
                .select(
                    'cp.plan_id',
                    'cp.plan_uuid',
                    'cp.nombre_plan',
                    'cp.descripcion_plan',
                    'cp.costo',
                    'cp.moneda',
                    'cp.limite_usuarios',
                    'cp.limite_almacenamiento_mb',
                    'cp.status',
                    'cp.dias_duracion',
                    'cp.total_timbres',
                    'cp.caracteristicas',
                    'cp.dias_gracia',
                )
            this.despachoRepoHelper.aplicarFiltrosPlanes(query, filtros);
            return await query;
        } catch (error) {
            console.error("Error en repo:", error);
            return null;
        }
    }


    // ---------------------------------------------
    // ---------- METRICAS Y REPORTES --------------
    // ---------------------------------------------

    async obtenerTotalDespachos(filtros?: any) {
        try {
            let query = this.knex('despachos as d')
                .count('d.despacho_id as total');
            this.despachoRepoHelper.aplicarFiltros(query, filtros);
            const result = await query;
            return result[0].total || 0;
        } catch (error) {
            console.error("Error en repo:", error);
            return 0;
        }
    }
    async obtenerTotalUsuariosGlobales() {
        try {
            let query = this.knex('usuarios_globales as ug')
                .count('ug.usuario_id as total');
            const result = await query;
            return result[0].total || 0;
        } catch (error) {
            console.error("Error en repo:", error);
            return 0;
        }
    }

    async obtenerBitacoras(filtros?: any) {
        try {
            const limit = filtros?.limit || 100; // Default: 100 registros

            let query = this.knex('bitacora_global as bg')
                .select(
                    'bg.modulo',
                    'bg.modulo_id',
                    'bg.descripcion',
                    'bg.fecha'
                )
                .orderBy('bg.fecha', 'desc')
                .limit(limit);

            this.despachoRepoHelper.aplicarFiltrosBitacora(query, filtros);

            return await query;

        } catch (error) {
            console.error("Error obteniendo bitácoras:", error);
            return [];
        }
    }
    async obtenerSuscripciones(filtros?: any) {
        let query = this.knex('suscripciones as s')
            .select(
                's.suscripcion_uuid',
                's.despacho_id',
                's.plan_id',
                's.fecha_inicio',
                's.fecha_fin',
                's.status',
                's.dias_gracia',
                'cp.nombre_plan',
                'cp.descripcion_plan',
                'd.razon_social as nombre_despacho'
            )
            .leftJoin('cat_planes as cp', 's.plan_id', 'cp.plan_id')
            .leftJoin('despachos as d', 's.despacho_id', 'd.despacho_id')
            .orderBy('s.fecha_inicio', 'desc');

        this.despachoRepoHelper.aplicarFiltrosSuscripciones(query, filtros);

        return await query;
    }
}