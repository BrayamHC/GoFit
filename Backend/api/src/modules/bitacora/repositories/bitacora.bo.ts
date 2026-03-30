import { Injectable } from '@nestjs/common';
import { AgregarBitacora } from '../dto/bitacora.validator';

@Injectable()
export class BitacoraBO {
    armarIbsertBitacora(data: AgregarBitacora): Record<string, unknown> {
        return {
            usuario_id: data.usuario_id ?? null,
            usuario_nombre: data.usuario_nombre ?? null,
            modulo: data.modulo,
            modulo_id: data.modulo_id ?? null,
            accion: data.accion,
            descripcion: data.descripcion,
            // fecha omitida → defaultTo(knex.fn.now()) en la migración
        };
    }
}