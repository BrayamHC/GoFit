import { Injectable } from '@nestjs/common';

@Injectable()
export class MembresiasBO {
    armarInsert(datos: any, usuario: any) {
        return {
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion?.trim() ?? null,
            caracteristicas: datos.caracteristicas ?? [],
            precio: datos.precio,
            moneda: datos.moneda ?? 'MXN',
            tipo: datos.tipo ?? 'mensual',
            dias_duracion: datos.dias_duracion,
            dias_gracia: datos.dias_gracia ?? 0,
            status: 'activo',
            usuario_creacion: usuario?.usuario_id ?? null,
        };
    }
}
