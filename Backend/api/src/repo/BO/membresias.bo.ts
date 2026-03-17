import { Injectable } from '@nestjs/common';

@Injectable()
export class MembresiasBO {
    armarInsert(datos: any, usuario: any) {
        return {
            nombre:                datos.nombre.trim(),
            descripcion:           datos.descripcion?.trim() ?? null,
            caracteristicas: datos.caracteristicas ?? [],  // ← sin JSON.stringify
            precio:                datos.precio,
            moneda:                datos.moneda ?? 'MXN',
            tipo:                  datos.tipo ?? 'mensual',
            dias_duracion:         datos.dias_duracion,
            dias_gracia:           datos.dias_gracia ?? 0,
            status:                'activo',
            fecha_creacion:        new Date(),
            fecha_actualizacion:   null,
            usuario_creacion:      usuario?.usuario_id ?? null,
            usuario_actualizacion: null,
        };
    }
}
