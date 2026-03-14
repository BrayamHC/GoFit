import { Injectable, Logger } from '@nestjs/common';
import { ClientesRepoData }   from '../repo/RepoData/clientes.repoData';
import { ClientesBO }         from '../repo/BO/clientes.bo';
import { ClientesRepoAction } from '../repo/actions/clientes.repoAction';
import { logSqlError }        from '../common/utils/log-sql-error';
import {
    ResourceNotFoundException,
    DatabaseQueryException,
    DuplicateResourceException,
} from '../common/exceptions';

@Injectable()
export class ClientesService {
    private readonly logger = new Logger(ClientesService.name);

    constructor(
        private readonly repoData:   ClientesRepoData,
        private readonly clientesBO: ClientesBO,
        private readonly repoAction: ClientesRepoAction,
    ) {}

    async obtenerClientes(filtros?: any) {
        try {
            this.logger.debug('Obteniendo clientes: ' + JSON.stringify(filtros));
            const clientes = await this.repoData.obtenerClientes(filtros);
            return clientes ?? [];
        } catch (error) {
            logSqlError(this.logger, 'obtenerClientes', error);
            throw new DatabaseQueryException('Error al obtener clientes');
        }
    }

    async obtenerClientePorId(clienteId: number) {
        try {
            const cliente = await this.repoData.obtenerClientePorId(clienteId);
            if (!cliente) throw new ResourceNotFoundException('Cliente', String(clienteId));
            return cliente;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'obtenerClientePorId', error);
            throw new DatabaseQueryException('Error al obtener cliente');
        }
    }

    async obtenerTotalClientes(filtros?: any) {
        try {
            return await this.repoData.obtenerTotalClientes(filtros);
        } catch (error) {
            logSqlError(this.logger, 'obtenerTotalClientes', error);
            throw new DatabaseQueryException('Error al obtener total de clientes');
        }
    }

    async crearCliente(datos: any) {
        try {
            // Validar email único solo si viene — status activo
            if (datos.email) {
                const existentes = await this.repoData.obtenerClientes({
                    email:  datos.email,
                    status: 'activo',
                });

                if (existentes && existentes.length > 0) {
                    throw new DuplicateResourceException('cliente', 'email');
                }
            }

            const nuevoCliente = this.clientesBO.armarInsert(datos);
            const clienteCreado = await this.repoAction.insertarCliente(nuevoCliente);

            this.logger.log(`Cliente creado: ${clienteCreado.nombre} ${clienteCreado.apellido} (ID: ${clienteCreado.cliente_id})`);

            return clienteCreado;
        } catch (error) {
            if (error instanceof DuplicateResourceException) throw error;
            logSqlError(this.logger, 'crearCliente', error);
            throw new DatabaseQueryException('Error al crear cliente');
        }
    }
}
