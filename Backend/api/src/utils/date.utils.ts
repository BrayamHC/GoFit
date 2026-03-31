// src/utils/date.utils.ts

/**
 * Parsear fecha ISO 8601 (YYYY-MM-DD) como fecha LOCAL (sin conversión UTC)
 * @param fechaStr - Fecha en formato YYYY-MM-DD
 * @returns Date object a las 12:00 PM hora local
 */
export function parseFechaLocal(fechaStr: string): Date {
    const [anio, mes, dia] = fechaStr.split('-').map(Number);

    // Crear fecha a las 12:00 PM hora LOCAL (evita edge cases de timezone)
    return new Date(anio, mes - 1, dia, 12, 0, 0, 0);
}

/**
 * Agregar días a una fecha
 */
export function agregarDias(fecha: Date, dias: number): Date {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    return nuevaFecha;
}

/**
 * Calcular días restantes desde hoy hasta una fecha fin (YYYY-MM-DD)
 * Retorna 0 si la fecha ya pasó
 */
export function calcularDiasRestantes(fechaFin: string | Date): number {
    const fechaStr = fechaFin instanceof Date ? fechaFin.toISOString() : fechaFin;
    const fechaSolo = fechaStr.split('T')[0];
    const hoy = parseFechaLocal(new Date().toISOString().split('T')[0]);
    const fin = parseFechaLocal(fechaSolo);
    return Math.max(0, Math.round((fin.getTime() - hoy.getTime()) / 86_400_000));
}
/**
 * Calcular duración en minutos entre fecha_entrada y fecha_salida
 */
export function calcularDuracionMinutos(fechaEntrada: Date | string, fechaSalida: Date | string): number {
    return Math.round((new Date(fechaSalida).getTime() - new Date(fechaEntrada).getTime()) / 60_000);
}