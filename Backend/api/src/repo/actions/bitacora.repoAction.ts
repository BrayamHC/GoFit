import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class BitacoraRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async insertarBitacora(datos: any): Promise<void> {
        await this.knex('bitacora').insert(datos);
    }
}
