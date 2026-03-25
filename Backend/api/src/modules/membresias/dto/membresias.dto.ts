import { createZodDto } from 'nestjs-zod';
import {
    CrearMembresiaSchema,
    ActualizarMembresiaSchema,
    CambiarStatusMembresiaSchema,
    FiltrosMembresiasSchema,
} from './membresias.validator';

export class CrearMembresiaDTO extends createZodDto(CrearMembresiaSchema) { }
export class ActualizarMembresiaDTO extends createZodDto(ActualizarMembresiaSchema) { }
export class CambiarStatusMembresiaDTO extends createZodDto(CambiarStatusMembresiaSchema) { }
export class FiltrosMembresiasDTO extends createZodDto(FiltrosMembresiasSchema) { }
