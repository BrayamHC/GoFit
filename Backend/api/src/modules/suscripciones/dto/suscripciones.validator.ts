import { z } from 'zod';

// ─── Schema base ──────────────────────────────────────────────
const SuscripcionSchema = z.object({
    cliente_id: z.number().int().positive(),
    membresia_id: z.number().int().positive(),
    fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido'),
    fecha_fin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD requerido'),
    dias_gracia: z.number().int().min(0).default(0),
    fecha_suspension: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    motivo_suspension: z.string().max(255).optional(),
    status: z.enum(['vigente', 'vencida', 'suspendida', 'eliminada']),
});

// ─── Schemas derivados ────────────────────────────────────────

// GET /suscripciones
export const FiltrosSuscripcionesSchema = z.object({
    cliente_id: z.coerce.number().int().positive().optional(),
    membresia_id: z.coerce.number().int().positive().optional(),
    status: z.enum(['vigente', 'vencida', 'suspendida', 'eliminada']).optional(),
    sort: z.enum(['fecha_inicio', 'fecha_fin', 'fecha_creacion']).optional(),
    dir: z.enum(['asc', 'desc']).optional(),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type Suscripcion = z.infer<typeof SuscripcionSchema>;
export type FiltrosSuscripciones = z.infer<typeof FiltrosSuscripcionesSchema>;
