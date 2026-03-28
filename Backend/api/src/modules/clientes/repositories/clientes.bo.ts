import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientesBO {
    armarInsert(datos: any) {
        return {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email ?? null,
            telefono: datos.telefono ?? null,
            fecha_nacimiento: datos.fecha_nacimiento ?? null,
            status: 'activo',
            usuario_creacion: datos.usuario_creacion,
        };
    }
}
