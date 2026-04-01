import { Injectable } from '@nestjs/common';
import { CrearRegistroFacialDTO, EncodingDTO } from './dto/registros-faciales.dto';
import { RegistrosFacialesRepoData } from './repositories/registros-faciales.repoData';
import { RegistrosFacialesRepoAction } from './repositories/registros-faciales.repoAction';

@Injectable()
export class RegistrosFacialesService {
    constructor(
        private readonly repoData: RegistrosFacialesRepoData,
        private readonly repoAction: RegistrosFacialesRepoAction,
    ) { }
    /**
     * Retorna todos los encodings activos.
     * Consumido por FastAPI Vision vía GET /registros-faciales/encodings.
     */
    async obtenerEncodings(): Promise<EncodingDTO[]> {
        return this.repoData.obtenerEncodingsActivos();
    }
    /**
     * Inserta un registro facial nuevo.
     * Llamado internamente desde clientes.coordinator al crear un cliente.
     */
    async crearRegistro(datos: CrearRegistroFacialDTO): Promise<void> {
        await this.repoAction.insertarRegistroFacial(datos);
    }
}
