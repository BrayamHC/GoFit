import { Injectable, Logger } from '@nestjs/common';
import { MembresiasRepoData } from '../repo/RepoData/membresias.repoData';
import { MembresiasBO } from '../repo/BO/membresias.bo';
import { MembresiasRepoAction } from '../repo/actions/membresias.repoAction';
import { logSqlError } from '../common/utils/log-sql-error';
import {
  ResourceNotFoundException,
  DatabaseQueryException,
  DuplicateResourceException,
} from '../common/exceptions';

@Injectable()
export class MembresiasService {
  private readonly logger = new Logger(MembresiasService.name);

  constructor(
    private readonly repoData: MembresiasRepoData,
    private readonly membresiasBO: MembresiasBO,
    private readonly repoAction: MembresiasRepoAction,
  ) {}

  async obtenerMembresias(filtros?: any) {
    try {
      this.logger.debug('Obteniendo membresias: ' + JSON.stringify(filtros));
      const membresias = await this.repoData.obtenerMembresias(filtros);
      return membresias ?? [];
    } catch (error) {
      logSqlError(this.logger, 'obtenerMembresias', error);
      throw new DatabaseQueryException('Error al obtener membresias');
    }
  }

  async obtenerMembresiaPorId(membresiaId: number) {
    try {
      const membresia = await this.repoData.obtenerMembresiaPorId(membresiaId);
      if (!membresia)
        throw new ResourceNotFoundException('Membresía', String(membresiaId));
      return membresia;
    } catch (error) {
      if (error instanceof ResourceNotFoundException) throw error;
      logSqlError(this.logger, 'obtenerMembresiaPorId', error);
      throw new DatabaseQueryException('Error al obtener membresía');
    }
  }

  async obtenerTotalMembresias(filtros?: any) {
    try {
      return await this.repoData.obtenerTotalMembresias(filtros);
    } catch (error) {
      logSqlError(this.logger, 'obtenerTotalMembresias', error);
      throw new DatabaseQueryException('Error al obtener total de membresias');
    }
  }

  async crearMembresia(datos: any, usuarioCreacion: any) {
    try {
      // Validar nombre único con status activo
      const existentes = await this.repoData.obtenerMembresias({
        nombre: datos.nombre,
        status: 'activo',
      });

      if (existentes && existentes.length > 0) {
        throw new DuplicateResourceException('membresía', 'nombre');
      }

      const nuevaMembresia = this.membresiasBO.armarInsert(
        datos,
        usuarioCreacion,
      );
      const membresiaCreada =
        await this.repoAction.insertarMembresia(nuevaMembresia);

      this.logger.log(
        `Membresía creada: ${membresiaCreada.nombre} (ID: ${membresiaCreada.membresia_id})`,
      );

      return membresiaCreada;
    } catch (error) {
      if (error instanceof DuplicateResourceException) throw error;
      logSqlError(this.logger, 'crearMembresia', error);
      throw new DatabaseQueryException('Error al crear membresía');
    }
  }
}
