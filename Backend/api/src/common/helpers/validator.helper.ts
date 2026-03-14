import { z, ZodError } from 'zod';
import { ValidationException } from '../exceptions';

export function validar<T>(schema: z.ZodSchema<T>, data: any): T {
    try {
        return schema.parse(data);
    } catch (error) {
        if (error instanceof ZodError) {
            const errores = error.issues.map((err) => ({
                campo: err.path.join('.'),
                mensaje: err.message,
            }));

            throw new ValidationException('Error de validacion', errores);
        }
        throw error;
    }
}
