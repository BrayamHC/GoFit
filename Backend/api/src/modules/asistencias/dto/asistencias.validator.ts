import { z } from 'zod';

// POST /asistencias — registrar entrada
export const RegistrarEntradaSchema = z.object({
    cliente_uuid: z.string().uuid('UUID de cliente inválido'),
    metodo_acceso: z.enum(['manual', 'facial', 'qr']),
    usuario_creacion: z.number().int().positive().optional(),
});

// PATCH /asistencias/:uuid/salida — no lleva body, el UUID va en la URL
// Se valida el param con este schema en el coordinator/controller
export const AsistenciaUuidParamSchema = z.object({
    uuid: z.string().uuid('UUID de cliente inválido'),
});

// GET /asistencias
export const FiltrosAsistenciasSchema = z.object({
    cliente_id: z.coerce.number().int().positive().optional(),
    status: z.enum(['activa', 'completada']).optional(),
    metodo_acceso: z.enum(['manual', 'facial', 'qr']).optional(),
    fecha_desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD').optional(),
    fecha_hasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use formato YYYY-MM-DD').optional(),
    sort: z.string().regex(/^(fecha_entrada|fecha_salida|duracion_minutos|total_accesos):(asc|desc)$/, 'Formato: campo:asc|desc').optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type RegistrarEntrada = z.infer<typeof RegistrarEntradaSchema>;
export type FiltrosAsistencias = z.infer<typeof FiltrosAsistenciasSchema>;