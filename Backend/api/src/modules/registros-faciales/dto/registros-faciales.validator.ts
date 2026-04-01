import { z } from 'zod';

// ─── Schema base ──────────────────────────────────────────────
const RegistroFacialSchema = z.object({
    cliente_id: z.number().int().positive('El cliente_id es requerido'),
    cliente_uuid: z.string().uuid('El cliente_uuid debe ser un UUID válido'),
    encoding: z
        .array(z.number().finite('Cada valor del encoding debe ser un número finito'))
        .length(128, 'El encoding debe tener exactamente 128 valores'),
});

// ─── Schemas derivados ────────────────────────────────────────

// Inserción interna desde clientes.coordinator
export const CrearRegistroFacialSchema = RegistroFacialSchema;

// Schema para el encoding individual de la respuesta a Vision
export const EncodingSchema = z.object({
    cliente_uuid: z.string().uuid(),
    encoding: z.array(z.number().finite()).length(128),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type CrearRegistroFacial = z.infer<typeof CrearRegistroFacialSchema>;
export type Encoding = z.infer<typeof EncodingSchema>;