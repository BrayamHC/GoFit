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
