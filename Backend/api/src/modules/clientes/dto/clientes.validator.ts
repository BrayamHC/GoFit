import { z } from 'zod';

// ─── Schema base — todos los campos del cliente ───────────────
const ClienteSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(120),
    apellido: z.string().min(1, 'El apellido es requerido').max(120),
    email: z.string().email('Email inválido').max(120).optional(),
    telefono: z.string().max(20).optional(),
    fecha_nacimiento: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida. Use formato YYYY-MM-DD')
        .optional(),
    status: z.enum(['activo', 'inactivo', 'eliminado']),
});

// ─── Schemas derivados ────────────────────────────────────────

// POST /clientes
export const CrearClienteSchema = ClienteSchema.omit({
    status: true,
}).extend({
    membresia_id: z.number().int().positive('La membresía es requerida'),
});

// PATCH /clientes/:id
export const ActualizarClienteSchema = ClienteSchema.omit({
    status: true,
}).partial();

// PATCH /clientes/:id/status
export const CambiarStatusClienteSchema = z.object({
    status: z.enum(['activo', 'inactivo', 'eliminado']),
});

// GET /clientes
export const FiltrosClientesSchema = z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    email: z.string().optional(),
    telefono: z.string().optional(),
    status: z.enum(['activo', 'inactivo', 'eliminado']).optional(),
    sort: z.enum(['nombre', 'apellido', 'email', 'fecha_creacion']).optional(),
    dir: z.enum(['asc', 'desc']).optional(),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type Cliente = z.infer<typeof ClienteSchema>;
export type CrearCliente = z.infer<typeof CrearClienteSchema>;
export type ActualizarCliente = z.infer<typeof ActualizarClienteSchema>;
export type FiltrosClientes = z.infer<typeof FiltrosClientesSchema>;
