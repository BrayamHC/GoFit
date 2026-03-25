import { createZodDto } from 'nestjs-zod';
import {
    CrearClienteSchema,
    ActualizarClienteSchema,
    CambiarStatusClienteSchema,
    FiltrosClientesSchema,
} from './clientes.validator';

export class CrearClienteDTO extends createZodDto(CrearClienteSchema) { }
export class ActualizarClienteDTO extends createZodDto(ActualizarClienteSchema) { }
export class CambiarStatusClienteDTO extends createZodDto(CambiarStatusClienteSchema) { }
export class FiltrosClientesDTO extends createZodDto(FiltrosClientesSchema) { }
