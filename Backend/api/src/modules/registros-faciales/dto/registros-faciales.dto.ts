import { createZodDto } from 'nestjs-zod';
import {
    CrearRegistroFacialSchema,
    EncodingSchema,
} from './registros-faciales.validator';

export class CrearRegistroFacialDTO extends createZodDto(CrearRegistroFacialSchema) { }
export class EncodingDTO extends createZodDto(EncodingSchema) { }