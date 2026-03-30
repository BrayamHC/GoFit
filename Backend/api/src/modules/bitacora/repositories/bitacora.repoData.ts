import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { BitacoraRepoHelper } from './bitacora.repoHelper';
import { FiltrosBitacora } from '../dto/bitacora.validator';

@Injectable()
export class BitacoraRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
        private readonly bitacoraRepoHelper: BitacoraRepoHelper,   // ← inyectado
    ) { }

    async obtenerBitacora(filtros?: FiltrosBitacora) {
        try {
            const query = this.knex('bitacora as b').select(
                'b.bitacora_id',
                'b.usuario_id',
                'b.usuario_nombre',
                'b.modulo',
                'b.modulo_id',
                'b.accion',
                'b.descripcion',
                'b.fecha',
            );
            this.bitacoraRepoHelper.aplicarFiltros(query, filtros);
            return await query;
        } catch (error) {
            console.error('Error obteniendo bitácora:', error);
            throw error;
        }
    }
}