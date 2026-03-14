import { Injectable } from '@nestjs/common';

@Injectable()
export class SuscripcionesBO {
    armarInsert(datos: { cliente_id: number; membresia_id: number; usuario_creacion: number }, membresia: any) {
        const fechaInicio = new Date();
        const fechaFin    = new Date();
        fechaFin.setDate(fechaFin.getDate() + membresia.dias_duracion);

        return {
            cliente_id:   datos.cliente_id,
            membresia_id: datos.membresia_id,
            fecha_inicio: fechaInicio,
            fecha_fin:    fechaFin,
            dias_gracia:  membresia.dias_gracia ?? 0,
            status:       'vigente',
            fecha_creacion:   new Date(),
            fecha_actualizacion: new Date(),
            usuario_creacion:    datos.usuario_creacion,
            usuario_actualizacion: null,
        };
    }
}
