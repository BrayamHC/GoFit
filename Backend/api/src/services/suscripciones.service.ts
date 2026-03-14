import { Injectable, Logger } from '@nestjs/common';
import { SuscripcionesBO }         from '../repo/BO/suscripciones.bo';
import { SuscripcionesRepoAction } from '../repo/actions/suscripciones.repoAction';
import { MembresiasRepoData }      from '../repo/RepoData/membresias.repoData';
import { logSqlError }             from '../common/utils/log-sql-error';
import {
    ResourceNotFoundException,
    DatabaseQueryException,
} from '../common/exceptions';

@Injectable()
export class SuscripcionesService {
    private readonly logger = new Logger(SuscripcionesService.name);

    constructor(
        private readonly suscripcionesBO:         SuscripcionesBO,
        private readonly suscripcionesRepoAction: SuscripcionesRepoAction,
        private readonly membresiasRepoData:      MembresiasRepoData,
    ) {}

    async crearSuscripcion(datos: {
        cliente_id:      number;
        membresia_id:    number;
        usuario_creacion: number;
    }) {
        try {
            // Obtener membresía para calcular fecha_fin y dias_gracia
            const membresia = await this.membresiasRepoData.obtenerMembresiaPorId(datos.membresia_id);

            if (!membresia) {
                throw new ResourceNotFoundException('Membresía', String(datos.membresia_id));
            }

            if (membresia.status !== 'activo') {
                throw new ResourceNotFoundException('Membresía activa', String(datos.membresia_id));
            }

            const nuevaSuscripcion = this.suscripcionesBO.armarInsert(datos, membresia);
            const suscripcionCreada = await this.suscripcionesRepoAction.insertarSuscripcion(nuevaSuscripcion);

            this.logger.log(
                `Suscripción creada: cliente ${datos.cliente_id} → membresía ${membresia.nombre} | vence: ${suscripcionCreada.fecha_fin}`,
            );

            return suscripcionCreada;
        } catch (error) {
            if (error instanceof ResourceNotFoundException) throw error;
            logSqlError(this.logger, 'crearSuscripcion', error);
            throw new DatabaseQueryException('Error al crear suscripción');
        }
    }
}
