import { Injectable, Logger } from '@nestjs/common';
import { AsistenciasRepoData } from './repositories/asistencias.repoData';
import { AsistenciasRepoAction } from './repositories/asistencias.repoAction';
import { AsistenciasBO } from './repositories/asistencias.bo';
import { FiltrosAsistencias, RegistrarEntrada } from './dto/asistencias.validator';
import { logSqlError } from '../../common/utils/log-sql-error';
import { DatabaseQueryException } from '../../common/exceptions';
import { calcularDuracionMinutos } from 'src/utils/date.utils';


@Injectable()
export class AsistenciasService {
    private readonly logger = new Logger(AsistenciasService.name);

    constructor(
        private readonly repoData: AsistenciasRepoData,
        private readonly repoAction: AsistenciasRepoAction,
        private readonly asistenciasBO: AsistenciasBO,
    ) { }

    async obtenerAsistencias(filtros?: FiltrosAsistencias) {
        return this.repoData.obtenerAsistencias(filtros);
    }

    async obtenerAsistenciaActivaHoy(clienteId: number) {
        try {
            return await this.repoData.obtenerAsistenciaActivaHoy(clienteId);
        } catch (error) {
            logSqlError(this.logger, 'obtenerAsistenciaActivaHoy', error);
            throw new DatabaseQueryException('Error al verificar asistencia activa');
        }
    }

    async registrarEntrada(datos: RegistrarEntrada, cliente: any, suscripcionVigente: any,) {
        try {
            const totalAccesos = (await this.repoData.contarAccesosPorCliente(cliente.cliente_id)) + 1;
            const insert = this.asistenciasBO.armarInsert(datos, cliente, suscripcionVigente, totalAccesos);
            const asistencia = await this.repoAction.insertarAsistencia(insert);

            this.logger.log(
                `Entrada registrada: cliente ${cliente.cliente_id} (${cliente.nombre} ${cliente.apellido}) | método: ${datos.metodo_acceso} | acceso #${totalAccesos}`,
            );
            return asistencia;
        } catch (error) {
            logSqlError(this.logger, 'registrarEntrada', error);
            throw new DatabaseQueryException('Error al registrar entrada');
        }
    }

    async registrarSalida(asistencia: any) {
        try {
            const cierre = this.asistenciasBO.armarCierre(asistencia);
            const asistenciaCerrada = await this.repoAction.cerrarAsistencia(asistencia, cierre);

            this.logger.log(
                `Salida registrada: asistencia ${asistencia.asistencia_id} | duración: ${cierre.duracion_minutos} min`,
            );
            return asistenciaCerrada;
        } catch (error) {
            logSqlError(this.logger, 'registrarSalida', error);
            throw new DatabaseQueryException('Error al registrar salida');
        }
    }
}