import { createZodDto } from 'nestjs-zod';
import { AgregarBitacoraSchema, FiltrosBitacoraSchema } from './bitacora.validator';

export class AgregarBitacoraDTO extends createZodDto(AgregarBitacoraSchema) { }
export class FiltrosBitacoraDTO extends createZodDto(FiltrosBitacoraSchema) { }