import { Injectable, Logger } from '@nestjs/common';
import { BitacoraBO } from '../repo/BO/bitacora.bo';
import { BitacoraRepoAction } from '../repo/actions/bitacora.repoAction';

@Injectable()
export class BitacoraService {
    private readonly logger = new Logger(BitacoraService.name);

    constructor(
        private readonly bitacoraBO: BitacoraBO,
        private readonly bitacoraRepoAction: BitacoraRepoAction,
    ) {}

    async registrar(datos: {
        usuario_id:     number;
        usuario_nombre: string;
        modulo:         string;
        modulo_id:      number | null;
        accion:         string;
        descripcion:    string;
    }): Promise<void> {
        try {
            const registro = this.bitacoraBO.armarInsert(datos);
            await this.bitacoraRepoAction.insertarBitacora(registro);
        } catch (error) {
            // La bitácora nunca debe tumbar el flujo principal
            this.logger.error('Error registrando en bitácora', error);
        }
    }
}
