import { createZodDto } from 'nestjs-zod';
import {
    RegistrarEntradaSchema,
    FiltrosAsistenciasSchema,
    AsistenciaUuidParamSchema,
} from './asistencias.validator';

export class RegistrarEntradaDTO extends createZodDto(RegistrarEntradaSchema) { }
export class FiltrosAsistenciasDTO extends createZodDto(FiltrosAsistenciasSchema) { }
export class AsistenciaUuidParamDTO extends createZodDto(AsistenciaUuidParamSchema) { }