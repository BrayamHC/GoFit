import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.email('El email no es válido'),
    password: z.string().min(6, 'La contraseña es requerida'),
});

// ─── Tipos exportados ─────────────────────────────────────────
export type Login = z.infer<typeof LoginSchema>;
