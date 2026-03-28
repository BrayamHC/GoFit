import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosBO {
    async armarInsert(datos: any) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
        const passwordHash = await bcrypt.hash(datos.password, saltRounds);

        return {
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            password: passwordHash,
            status: 'activo',
            usuario_creacion: datos.usuario_creacion,
        };
    }

    armarUpdate(datos: any, usuarioActualizacion: number) {
        return {
            ...(datos.nombre && { nombre: datos.nombre }),
            ...(datos.apellido && { apellido: datos.apellido }),
            ...(datos.email && { email: datos.email }),
            fecha_actualizacion: new Date(),
            usuario_actualizacion: usuarioActualizacion,
        };
    }

    armarUpdateStatus(status: string, usuarioActualizacion: number) {
        return {
            status,
            fecha_actualizacion: new Date(),
            usuario_actualizacion: usuarioActualizacion,
        };
    }
}
