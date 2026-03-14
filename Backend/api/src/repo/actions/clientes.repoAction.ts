import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class ClientesRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) {}

    async insertarCliente(datos: any) {
        const [cliente] = await this.knex('clientes')
            .insert(datos)
            .returning([
                'cliente_id',
                'cliente_uuid',
                'nombre',
                'apellido',
                'email',
                'status',
            ]);
        return cliente;
    }
}
