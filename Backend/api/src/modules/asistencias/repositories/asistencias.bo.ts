import { Injectable } from '@nestjs/common';
import { RegistrarEntrada } from '../dto/asistencias.validator';
import { calcularDiasRestantes, calcularDuracionMinutos } from '../../../utils/date.utils';

@Injectable()
export class AsistenciasBO {
    armarInsert(
        datos: RegistrarEntrada, cliente: { cliente_id: number; nombre: string; apellido: string }, suscripcionVigente: { fecha_fin: string | Date; membresia_nombre: string } | null, totalAccesos: number,
    ) {
        return {
            cliente_id: cliente.cliente_id,
            nombre_cliente: `${cliente.nombre} ${cliente.apellido}`.trim(),
            metodo_acceso: datos.metodo_acceso,
            dias_restantes_suscripcion: suscripcionVigente
                ? calcularDiasRestantes(suscripcionVigente.fecha_fin)
                : null,
            membresia_nombre: suscripcionVigente?.membresia_nombre ?? null,
            total_accesos: totalAccesos,
            usuario_creacion: datos.usuario_creacion ?? null,
        };
    }

    armarCierre(asistencia: { fecha_entrada: Date | string }) {
        const fechaSalida = new Date();
        const duracionMinutos = calcularDuracionMinutos(asistencia.fecha_entrada, fechaSalida);
        return {
            fecha_salida: fechaSalida,
            duracion_minutos: duracionMinutos,
            status: 'completada' as const,
        };
    }
}