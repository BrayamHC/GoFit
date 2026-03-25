import { Injectable, Logger } from '@nestjs/common';
import { SuscripcionesRepoData } from './repositories/suscripciones.repoData';
import { SuscripcionesBO } from './repositories/suscripciones.bo';
import { SuscripcionesRepoAction } from './repositories/suscripciones.repoAction';
import { MembresiasRepoData } from '../membresias/repositories/membresias.repoData';
import { logSqlError } from '../../common/utils/log-sql-error';
import {
    ResourceNotFoundException,
    DatabaseQueryException,
} from '../../common/exceptions';

@Injectable()
export class SuscripcionesService {
    private readonly logger = new Logger(SuscripcionesService.name);

    constructor(
        private readonly repoData: SuscripcionesRepoData,
        private readonly suscripcionesBO: SuscripcionesBO,
        private readonly repoAction: SuscripcionesRepoAction,
        private readonly membresiasRepoData: MembresiasRepoData,
    ) { }

    async obtenerSuscripciones(filtros?: any) {
        try {
            this.logger.debug('Obteniendo suscripciones: ' + JSON.stringify(filtros));
            return (await this.repoData.obtenerSuscripciones(filtros)) ?? [];
        } catch (error) {
            logSqlError(this.logger, 'obtenerSuscripciones', error);
            throw new DatabaseQueryException('Error al obtener suscripciones');
        }
    }

    async obtenerSuscripcionPorId(suscripcionId: number) {
        try {
            const suscripcion = await this.repoData.obtenerSuscripcionPorId(suscripcionId);
            if (!suscripcion) throw new ResourceNotFoundException('Suscripción', String(suscripcionId));
            return suscripcion;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'obtenerSuscripcionPorId', error);
            throw new DatabaseQueryException('Error al obtener suscripción');
        }
    }

    async obtenerSuscripcionesPorCliente(clienteId: number) {
        try {
            return (await this.repoData.obtenerSuscripcionesPorCliente(clienteId)) ?? [];
        } catch (error) {
            logSqlError(this.logger, 'obtenerSuscripcionesPorCliente', error);
            throw new DatabaseQueryException('Error al obtener suscripciones del cliente');
        }
    }

    async obtenerTotalSuscripciones(filtros?: any) {
        try {
            return await this.repoData.obtenerTotalSuscripciones(filtros);
        } catch (error) {
            logSqlError(this.logger, 'obtenerTotalSuscripciones', error);
            throw new DatabaseQueryException('Error al obtener total de suscripciones');
        }
    }

    async crearSuscripcion(datos: { cliente_id: number; membresia_id: number; usuario_creacion: number }) {
        try {
            // Obtener membresía — mismo método de listado, filtramos por ID
            const membresias = await this.membresiasRepoData.obtenerMembresias({
                membresia_id: datos.membresia_id,
                status: 'activo',
            });

            if (!membresias || membresias.length === 0)
                throw new ResourceNotFoundException('Membresía', String(datos.membresia_id));

            const membresia = membresias[0];
            const nuevaSuscripcion = this.suscripcionesBO.armarInsert(datos, membresia);
            const suscripcionCreada = await this.repoAction.insertarSuscripcion(nuevaSuscripcion);

            this.logger.log(
                `Suscripción creada: cliente ${datos.cliente_id} → ${membresia.nombre} | vence: ${suscripcionCreada.fecha_fin}`,
            );
            return suscripcionCreada;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'crearSuscripcion', error);
            throw new DatabaseQueryException('Error al crear suscripción');
        }
    }
}
