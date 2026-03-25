import { z } from 'zod';

// ─── Schema base ──────────────────────────────────────────────
const UsuarioSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(120),
    apellido: z.string().min(1, 'El apellido es requerido').max(120),
    email: z.string().email('El email no es válido').max(120),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    status: z.enum(['activo', 'inactivo', 'eliminado']),
});

// ─── Schemas derivados ────────────────────────────────────────

// POST /usuarios
export const CrearUsuarioSchema = UsuarioSchema.omit({ status: true });

// PATCH /usuarios/:uuid
export const EditarUsuarioSchema = UsuarioSchema.omit({
    status: true,
    password: true,
}).partial();

// PATCH /usuarios/:uuid/status
export const CambiarStatusUsuarioSchema = z.object({
    status: z.enum(['activo', 'inactivo', 'eliminado']),
});

// GET /usuarios
export const FiltrosUsuariosSchema = z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    email: z.string().optional(),
    status: z.enum(['activo', 'inactivo', 'eliminado']).optional(),
    sort: z.enum(['nombre', 'apellido', 'email', 'fecha_creacion']).optional(),
    dir: z.enum(['asc', 'desc']).optional(),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type Usuario = z.infer<typeof UsuarioSchema>;
export type CrearUsuario = z.infer<typeof CrearUsuarioSchema>;
export type EditarUsuario = z.infer<typeof EditarUsuarioSchema>;
export type FiltrosUsuarios = z.infer<typeof FiltrosUsuariosSchema>;
