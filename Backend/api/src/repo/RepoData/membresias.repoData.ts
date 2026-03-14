import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { MembresiasRepoHelper } from '../helpers/membresias.repoHelper';

@Injectable()
export class MembresiasRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async obtenerMembresias(filtros?: any) {
        try {
            const query = this.knex('membresias as m')
                .select(
                    'm.membresia_id',
                    'm.membresia_uuid',
                    'm.nombre',
                    'm.descripcion',
                    'm.precio',
                    'm.moneda',
                    'm.dias_duracion',
                    'm.dias_gracia',
                    'm.status',
                    'm.fecha_creacion',
                    'm.fecha_actualizacion',
                );

            MembresiasRepoHelper.aplicarFiltros(query, filtros);
            MembresiasRepoHelper.aplicarOrden(query, filtros);

            return await query;
        } catch (error) {
            console.error('Error obteniendo membresias:', error);
            throw error;
        }
    }

    async obtenerMembresiaPorId(membresiaId: number) {
        try {
            return await this.knex('membresias as m')
                .select(
                    'm.membresia_id',
                    'm.membresia_uuid',
                    'm.nombre',
                    'm.descripcion',
                    'm.precio',
                    'm.moneda',
                    'm.dias_duracion',
                    'm.dias_gracia',
                    'm.status',
                    'm.fecha_creacion',
                    'm.fecha_actualizacion',
                )
                .where('m.membresia_id', membresiaId)
                .first();
        } catch (error) {
            console.error('Error obteniendo membresia por id:', error);
            throw error;
        }
    }

    async obtenerTotalMembresias(filtros?: any) {
        try {
            const query = this.knex('membresias as m').count('m.membresia_id as total');
            MembresiasRepoHelper.aplicarFiltros(query, filtros);
            const resultado = await query.first();
            return Number(resultado?.total ?? 0);
        } catch (error) {
            console.error('Error obteniendo total membresias:', error);
            throw error;
        }
    }
}
