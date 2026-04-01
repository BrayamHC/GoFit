import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { EncodingDTO } from '../dto/registros-faciales.dto';
import { RegistrosFacialesRepoHelper } from './registros-faciales.repoHelper';

@Injectable()
export class RegistrosFacialesRepoData {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async obtenerEncodingsActivos(): Promise<EncodingDTO[]> {
        const filas = await this.knex('registros_faciales')
            .where('status', 'activo')
            .select('cliente_uuid', 'encoding');

        return filas.map(RegistrosFacialesRepoHelper.normalizarEncoding);
    }
}