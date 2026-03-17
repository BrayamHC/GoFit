import { Injectable, Logger } from '@nestjs/common';
import { SuscripcionesBO } from '../repo/BO/suscripciones.bo';
import { SuscripcionesRepoAction } from '../repo/actions/suscripciones.repoAction';
import { MembresiasRepoData } from '../repo/RepoData/membresias.repoData';
import { logSqlError } from '../common/utils/log-sql-error';
import {
  ResourceNotFoundException,
  DatabaseQueryException,
} from '../common/exceptions';
import { SuscripcionesRepoData } from 'src/repo/RepoData/suscripciones.repoData';

@Injectable()
export class SuscripcionesService {
  private readonly logger = new Logger(SuscripcionesService.name);

  constructor(
    private readonly suscripcionesBO: SuscripcionesBO,
    private readonly suscripcionesRepoAction: SuscripcionesRepoAction,
    private readonly membresiasRepoData: MembresiasRepoData,
    private readonly suscripcionesRepoData: SuscripcionesRepoData,
  ) {}

  async crearSuscripcion(datos: {
    cliente_id: number;
    membresia_id: number;
    usuario_creacion: number;
  }) {
    try {
      // Obtener membresía para calcular fecha_fin y dias_gracia
      const membresia = await this.membresiasRepoData.obtenerMembresiaPorId(
        datos.membresia_id,
      );

      if (!membresia) {
        throw new ResourceNotFoundException(
          'Membresía',
          String(datos.membresia_id),
        );
      }

      if (membresia.status !== 'activo') {
        throw new ResourceNotFoundException(
          'Membresía activa',
          String(datos.membresia_id),
        );
      }

      const nuevaSuscripcion = this.suscripcionesBO.armarInsert(
        datos,
        membresia,
      );
      const suscripcionCreada =
        await this.suscripcionesRepoAction.insertarSuscripcion(
          nuevaSuscripcion,
        );

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
  async obtenerSuscripciones(filtros?: any) {
    try {
      this.logger.debug('Obteniendo suscripciones: ' + JSON.stringify(filtros));
      return (await this.suscripcionesRepoData.obtenerSuscripciones(filtros)) ?? [];
    } catch (error) {
      logSqlError(this.logger, 'obtenerSuscripciones', error);
      throw new DatabaseQueryException('Error al obtener suscripciones');
    }
  }

  async obtenerSuscripcionPorId(suscripcionId: number) {
    try {
      const suscripcion =
        await this.suscripcionesRepoData.obtenerSuscripcionPorId(suscripcionId);
      if (!suscripcion)
        throw new ResourceNotFoundException(
          'Suscripción',
          String(suscripcionId),
        );
      return suscripcion;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) throw error;
      logSqlError(this.logger, 'obtenerSuscripcionPorId', error);
      throw new DatabaseQueryException('Error al obtener suscripción');
    }
  }

  async obtenerSuscripcionesPorCliente(clienteId: number) {
    try {
      return (
        (await this.suscripcionesRepoData.obtenerSuscripcionesPorCliente(clienteId)) ?? []
      );
    } catch (error) {
      logSqlError(this.logger, 'obtenerSuscripcionesPorCliente', error);
      throw new DatabaseQueryException(
        'Error al obtener suscripciones del cliente',
      );
    }
  }

  async obtenerTotalSuscripciones(filtros?: any) {
    try {
      return await this.suscripcionesRepoData.obtenerTotalSuscripciones(filtros);
    } catch (error) {
      logSqlError(this.logger, 'obtenerTotalSuscripciones', error);
      throw new DatabaseQueryException(
        'Error al obtener total de suscripciones',
      );
    }
  }
}
