import { z } from 'zod';

const BitacoraSchema = z.object({
    usuario_id: z.number().int().positive().nullable().optional(),
    usuario_nombre: z.string().max(241).nullable().optional(),
    modulo: z.string().min(1).max(50),
    modulo_id: z.number().int().positive().nullable().optional(),
    accion: z.string().min(1).max(50),
    descripcion: z.string().min(1),
});

export const AgregarBitacoraSchema = BitacoraSchema;

export const FiltrosBitacoraSchema = z.object({
    modulo: z.string().optional(),
    accion: z.string().optional(),
    usuario_id: z.coerce.number().int().positive().optional(),
    fecha_desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD').optional(),
    fecha_hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD').optional(),
    sort: z.enum(['fecha', 'modulo', 'accion']).optional(),
    dir: z.enum(['asc', 'desc']).optional(),
});

export type AgregarBitacora = z.infer<typeof AgregarBitacoraSchema>;
export type FiltrosBitacora = z.infer<typeof FiltrosBitacoraSchema>;