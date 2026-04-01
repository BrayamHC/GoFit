import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { CrearRegistroFacialDTO } from '../dto/registros-faciales.dto';

@Injectable()
export class RegistrosFacialesRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async insertarRegistroFacial(datos: CrearRegistroFacialDTO): Promise<void> {
        await this.knex('registros_faciales').insert({
            cliente_id: datos.cliente_id,
            cliente_uuid: datos.cliente_uuid,
            encoding: JSON.stringify(datos.encoding),
            status: 'activo',
        });
    }
}