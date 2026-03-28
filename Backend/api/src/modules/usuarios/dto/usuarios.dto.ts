import { createZodDto } from 'nestjs-zod';
import {
    CrearUsuarioSchema,
    EditarUsuarioSchema,
    CambiarStatusUsuarioSchema,
    FiltrosUsuariosSchema,
} from './usuarios.validator';

export class CrearUsuarioDTO extends createZodDto(CrearUsuarioSchema) { }
export class EditarUsuarioDTO extends createZodDto(EditarUsuarioSchema) { }
export class CambiarStatusUsuarioDTO extends createZodDto(CambiarStatusUsuarioSchema) { }
export class FiltrosUsuariosDTO extends createZodDto(FiltrosUsuariosSchema) { }
