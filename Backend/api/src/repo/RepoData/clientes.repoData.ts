import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { ClientesRepoHelper } from '../helpers/clientes.repoHelper';

@Injectable()
export class ClientesRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async obtenerClientes(filtros?: any) {
        try {
            const query = this.knex('clientes as c')
                .select(
                    'c.cliente_id',
                    'c.cliente_uuid',
                    'c.nombre',
                    'c.apellido',
                    'c.email',
                    'c.telefono',
                    'c.fecha_nacimiento',
                    'c.status',
                    'c.fecha_creacion',
                    'c.fecha_actualizacion',
                );

            ClientesRepoHelper.aplicarFiltros(query, filtros);
            ClientesRepoHelper.aplicarOrden(query, filtros);

            return await query;
        } catch (error) {
            console.error('Error obteniendo clientes:', error);
            throw error;
        }
    }

    async obtenerClientePorId(clienteId: number) {
        try {
            return await this.knex('clientes as c')
                .select(
                    'c.cliente_id',
                    'c.cliente_uuid',
                    'c.nombre',
                    'c.apellido',
                    'c.email',
                    'c.telefono',
                    'c.fecha_nacimiento',
                    'c.status',
                    'c.fecha_creacion',
                    'c.fecha_actualizacion',
                )
                .where('c.cliente_id', clienteId)
                .first();
        } catch (error) {
            console.error('Error obteniendo cliente por id:', error);
            throw error;
        }
    }

    async obtenerTotalClientes(filtros?: any) {
        try {
            const query = this.knex('clientes as c').count('c.cliente_id as total');
            ClientesRepoHelper.aplicarFiltros(query, filtros);
            const resultado = await query.first();
            return Number(resultado?.total ?? 0);
        } catch (error) {
            console.error('Error obteniendo total clientes:', error);
            throw error;
        }
    }
}
