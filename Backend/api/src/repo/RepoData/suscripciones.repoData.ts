import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { SuscripcionesRepoHelper } from '../helpers/suscripciones.repoHelper';

@Injectable()
export class SuscripcionesRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    private selectFields(): (string | Knex.Raw)[] {
        return [
            's.suscripcion_id',
            's.suscripcion_uuid',
            's.cliente_id',
            's.membresia_id',
            's.fecha_inicio',
            's.fecha_fin',
            's.dias_gracia',
            's.fecha_suspension',
            's.motivo_suspension',
            's.status',
            's.fecha_creacion',
            's.fecha_actualizacion',
            // Cliente
            this.knex.raw("CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre"),
            'c.email    AS cliente_email',
            'c.telefono AS cliente_telefono',
            // Membresía
            'm.nombre       AS membresia_nombre',
            'm.precio        AS membresia_precio',
            'm.moneda        AS membresia_moneda',
            'm.dias_duracion AS membresia_dias_duracion',
        ];
    }

    async obtenerSuscripciones(filtros?: any) {
        try {
            const query = this.knex('suscripciones as s')
                .select(this.selectFields())
                .leftJoin('clientes as c',   's.cliente_id',   'c.cliente_id')
                .leftJoin('membresias as m', 's.membresia_id', 'm.membresia_id');

            SuscripcionesRepoHelper.aplicarFiltros(query, filtros);
            SuscripcionesRepoHelper.aplicarOrden(query, filtros);

            return await query;
        } catch (error) {
            console.error('Error obteniendo suscripciones:', error);
            throw error;
        }
    }

    async obtenerSuscripcionPorId(suscripcionId: number) {
        try {
            return await this.knex('suscripciones as s')
                .select(this.selectFields())
                .leftJoin('clientes as c',   's.cliente_id',   'c.cliente_id')
                .leftJoin('membresias as m', 's.membresia_id', 'm.membresia_id')
                .where('s.suscripcion_id', suscripcionId)
                .first();
        } catch (error) {
            console.error('Error obteniendo suscripción por id:', error);
            throw error;
        }
    }

    async obtenerSuscripcionesPorCliente(clienteId: number) {
        try {
            return await this.knex('suscripciones as s')
                .select(this.selectFields())
                .leftJoin('clientes as c',   's.cliente_id',   'c.cliente_id')
                .leftJoin('membresias as m', 's.membresia_id', 'm.membresia_id')
                .where('s.cliente_id', clienteId)
                .orderBy('s.fecha_creacion', 'desc');
        } catch (error) {
            console.error('Error obteniendo suscripciones por cliente:', error);
            throw error;
        }
    }

    async obtenerTotalSuscripciones(filtros?: any) {
        try {
            const query = this.knex('suscripciones as s')
                .count('s.suscripcion_id as total');
            SuscripcionesRepoHelper.aplicarFiltros(query, filtros);
            const resultado = await query.first();
            return Number(resultado?.total ?? 0);
        } catch (error) {
            console.error('Error obteniendo total suscripciones:', error);
            throw error;
        }
    }
}
