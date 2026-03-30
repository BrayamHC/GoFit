import { Injectable } from '@nestjs/common';
import { BitacoraBO } from './repositories/bitacora.bo';
import { BitacoraRepoAction } from './repositories/bitacora.repoAction';
import { BitacoraRepoData } from './repositories/bitacora.repoData';
import { AgregarBitacora, FiltrosBitacora } from './dto/bitacora.validator';

@Injectable()
export class BitacoraService {
    constructor(
        private readonly bo: BitacoraBO,
        private readonly repoAction: BitacoraRepoAction,
        private readonly repoData: BitacoraRepoData,
    ) { }

    async agregarBitacora(data: AgregarBitacora): Promise<void> {
        const insertData = this.bo.armarIbsertBitacora(data);
        await this.repoAction.insert(insertData);
    }

    async obtenerBitacora(filtros?: FiltrosBitacora) {
        return this.repoData.obtenerBitacora(filtros);
    }
}