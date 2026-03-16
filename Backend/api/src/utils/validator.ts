import { BadRequestException } from '@nestjs/common';
import { z } from 'zod'; //


export function validar<T>(schema: z.ZodSchema<T>, data: any): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errores = error.issues.map(err => ({
                campo: err.path.join('.'),
                mensaje: err.message
            }));

            throw new BadRequestException({
                message: 'Error de validación',
                errors: errores
            });
        }
        throw error;
    }
}

// ESQUEMAS

// ── Clientes ──────────────────────────────────────
export const CrearClienteSchema = z.object({
    nombre:           z.string().min(1).max(120),
    apellido:         z.string().min(1).max(120),
    email:            z.string().email().max(120).optional(),
    telefono:         z.string().max(20).optional(),
    fecha_nacimiento: z.string().date().optional(),
    membresia_id:     z.number().int().positive().optional(),
});

// ── Membresías ────────────────────────────────────
export const CrearMembresiaSchema = z.object({
    nombre:       z.string().min(1).max(100),
    descripcion:  z.string().optional(),
    precio:       z.number().positive(),
    moneda:       z.string().max(10).default('MXN'),
    dias_duracion: z.number().int().positive(),
    dias_gracia:  z.number().int().min(0).default(0),
});























// //DESPACHO
// export const CrearDespachoSchema = z.object({
//     // Datos del despacho
//     razon_social: z.string().min(1, 'La razón social es requerida'),
//     nombre_comercial: z.string().min(1, 'El nombre corto es requerido'),
//     subdominio: z.string().min(1, 'El subdominio es requerido'),
//     rfc: z.string().min(12, 'El RFC es requerido'),
//     // Datos del usuario admin del despacho
//     password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
//     email: z.email('El email no es válido'),
//     nombre_completo: z.string().min(1, 'El nombre completo es requerido'),
//     telefono: z.string().min(10, 'El teléfono es requerido'),
//     direccion: z.string().optional(),
//     // Datos opcionales del despacho
//     fecha_activacion: z.string()
//         .regex(/^\d{4}[-\/]\d{2}[-\/]\d{2}$/, 'Fecha inválida. Use formato adecuado (YYYY-MM-DD)')
//         .transform((fecha) => fecha.replace(/\//g, '-'))
//         .optional(),
//     zona_id: z.number().int().positive().optional(),
//     plan_id: z.number().int().positive().optional(),
//     nota: z.string().optional(),
// });

// export const ActualizarDespachoSchema = z.object({
//     despacho_id: z.number().int().positive('El ID del despacho es requerido'),

//     // Datos despacho
//     nombre_comercial: z.string().min(1, 'El nombre comercial no puede estar vacío').optional(),
//     zona_id: z.number().int().positive('La zona ID debe ser un número positivo').optional(),
//     plan_id: z.number().int().positive('El plan ID debe ser un número positivo').optional(),
//     nota: z.string().optional(),

//     // Datos usuario admin
//     email: z.email('El email no es válido').optional(),
//     nombre_completo: z.string().min(1, 'El nombre completo no puede estar vacío').optional(),
//     telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres').optional(),
//     direccion: z.string().optional(),
// })
//     .refine((data) => {
//         const { despacho_id, ...camposActualizar } = data;
//         return Object.keys(camposActualizar).length > 0;
//     }, {
//         message: 'Debe proporcionar al menos un campo para actualizar',
//         path: ['campos'],
//     });

// export const DesactivarDespachoSchema = z.object({
//     despacho_id: z.number().int().positive('El ID del despacho es requerido'),
//     status: z.enum(['inactivo'])
// })

// export const EliminarDespachoSchema = z.object({
//     despacho_id: z.number().int().positive('El ID del despacho es requerido'),
//     status: z.enum(['eliminado'])
// })

// export const ActivarDespachoSchema = z.object({
//     despacho_id: z.number().int().positive('El ID del despacho es requerido'),
//     status: z.enum(['activo'])
// })

// //LOGIN
// export const LoginSchema = z.object({
//     password: z.string().min(6, 'La contraseña es requerida'),
//     email: z.email('El email no es válido'),
// });

export const LoginGlobalSchema = z.object({
    email: z.email('El email no es válido'),
    password: z.string().min(6, 'La contraseña es requerida'),
});

// //USUARIOS_GLOBALES
// export const CrearUsuarioGlobalSchema = z.object({
//     nombre: z.string().min(1, 'El nombre corto es requerido'),
//     email: z.email('El email no es válido'),
//     password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
// });

// //PLANES

// export const CrearPlanSchema = z.object({
//     nombrePlan: z.string().min(1, 'El nombre del plan es requerido'),
//     descripcionPlan: z.string().optional(),
//     costo: z.number().positive('El costo del plan es requerido'),
//     moneda: z.string().min(1, 'La moneda es requerida'),
//     limiteUsuarios: z.number().int().positive('El limite de usuarios es requerido'),
//     limiteAlmacenamientoMb: z.number().int().positive('El limite de almacenamiento es requerido'),
//     diasDuracion: z.number().int().positive('Los dias de duracion son requeridos'),
//     totalTimbres: z.number().positive('El total de timbres es requerido'),
//     caracteristicas: z.array(z.string().min(1)).default([]),
//     diasGracia: z.number().int().nonnegative('Los días de gracia no pueden ser negativos').nullable().optional(),
// })


