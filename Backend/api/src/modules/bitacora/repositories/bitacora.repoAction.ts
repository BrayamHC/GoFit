import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class BitacoraRepoAction {
    constructor(
        @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    ) { }

    async insert(data: Record<string, unknown>): Promise<void> {
        try {
            await this.knex('bitacora').insert(data);
        } catch (error) {
            console.error('Error insertando en bitácora:', error);
            throw error;
        }
    }
}