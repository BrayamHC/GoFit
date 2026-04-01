import { EncodingDTO } from '../dto/registros-faciales.dto';

export interface RegistroFacialBO {
    registro_id: number;
    cliente_id: number;
    cliente_uuid: string;
    encoding: number[];
    status: 'activo' | 'inactivo';
    fecha_creacion: Date;
}

export interface EncodingsBO {
    encodings: EncodingDTO[];
    total: number;
}
