import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientesBO {
    armarInsert(datos: any) {
        return {
            nombre:           datos.nombre.trim(),
            apellido:         datos.apellido.trim(),
            email:            datos.email?.toLowerCase().trim() ?? null,
            telefono:         datos.telefono?.trim() ?? null,
            fecha_nacimiento: datos.fecha_nacimiento ?? null,
            status:           'activo',
            fecha_creacion:   new Date(),
            fecha_actualizacion: new Date(),
            usuario_creacion:    datos.usuario_creacion,
            usuario_actualizacion: null,
        };
    }
}
