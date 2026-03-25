import { z } from 'zod';

// ─── Schema base — todos los campos de la membresía ───────────
const MembresiaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    descripcion: z.string().optional(),
    caracteristicas: z.array(z.string().max(100)).max(8).default([]),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    moneda: z.string().max(10).default('MXN'),
    tipo: z.enum(['mensual', 'trimestral', 'semestral', 'anual', 'personalizado']).default('mensual'),
    dias_duracion: z.number().int().positive('Los días de duración deben ser mayor a 0'),
    dias_gracia: z.number().int().min(0).default(0),
    status: z.enum(['activo', 'inactivo']),
});

// ─── Schemas derivados ────────────────────────────────────────

// POST /membresias
export const CrearMembresiaSchema = MembresiaSchema.omit({
    status: true,
});

// PATCH /membresias/:id
export const ActualizarMembresiaSchema = MembresiaSchema.omit({
    status: true,
}).partial();

// PATCH /membresias/:id/status
export const CambiarStatusMembresiaSchema = z.object({
    status: z.enum(['activo', 'inactivo']),
});

// GET /membresias
export const FiltrosMembresiasSchema = z.object({
    nombre: z.string().optional(),
    tipo: z.enum(['mensual', 'trimestral', 'semestral', 'anual', 'personalizado']).optional(),
    moneda: z.string().optional(),
    precio_min: z.coerce.number().positive().optional(),
    precio_max: z.coerce.number().positive().optional(),
    dias_duracion: z.coerce.number().int().positive().optional(),
    status: z.enum(['activo', 'inactivo']).optional(),
    sort: z.enum(['nombre', 'precio', 'dias_duracion', 'fecha_creacion']).optional(),
    dir: z.enum(['asc', 'desc']).optional(),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type Membresia = z.infer<typeof MembresiaSchema>;
export type CrearMembresia = z.infer<typeof CrearMembresiaSchema>;
export type ActualizarMembresia = z.infer<typeof ActualizarMembresiaSchema>;
export type FiltrosMembresias = z.infer<typeof FiltrosMembresiasSchema>;
