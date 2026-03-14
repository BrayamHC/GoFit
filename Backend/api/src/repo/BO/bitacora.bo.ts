import { Injectable } from '@nestjs/common';

@Injectable()
export class BitacoraBO {
    armarInsert(datos: {
        usuario_id:     number;
        usuario_nombre: string;
        modulo:         string;
        modulo_id:      number | null;
        accion:         string;
        descripcion:    string;
    }) {
        return {
            usuario_id:     datos.usuario_id,
            usuario_nombre: datos.usuario_nombre,
            modulo:         datos.modulo,
            modulo_id:      datos.modulo_id ?? null,
            accion:         datos.accion,
            descripcion:    datos.descripcion,
            fecha:          new Date(),
        };
    }
}
