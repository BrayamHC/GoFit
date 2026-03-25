import { createZodDto } from 'nestjs-zod';
import { FiltrosSuscripcionesSchema } from './suscripciones.validator';

export class FiltrosSuscripcionesDTO extends createZodDto(FiltrosSuscripcionesSchema) { }
