import { Injectable } from '@nestjs/common';

@Injectable()
export class MembresiasBO {
    armarInsert(datos: any) {
        return {
            nombre:       datos.nombre.trim(),
            descripcion:  datos.descripcion?.trim() ?? null,
            precio:       datos.precio,
            moneda:       datos.moneda ?? 'MXN',
            dias_duracion: datos.dias_duracion,
            dias_gracia:  datos.dias_gracia ?? 0,
            status:       'activo',
            fecha_creacion:   new Date(),
            fecha_actualizacion: new Date(),
            usuario_creacion:    datos.usuario_creacion,
            usuario_actualizacion: null,
        };
    }
}
