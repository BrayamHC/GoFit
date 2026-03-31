import { Injectable, Logger } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { ClientesService } from '../clientes/clientes.service';
import { SuscripcionesService } from '../suscripciones/suscripciones.service';
import { BitacoraService } from '../bitacora/bitacora.service';
import { RegistrarEntrada } from './dto/asistencias.validator';
import {
    ResourceNotFoundException,
    InactiveClienteException,
    SinSuscripcionVigenteException,
    AsistenciaEnCursoException,
    SinAsistenciaActivaException,
} from '../../common/exceptions';


@Injectable()
export class AsistenciasCoordinator {
    private readonly logger = new Logger(AsistenciasCoordinator.name);

    constructor(
        private readonly asistenciasService: AsistenciasService,
        private readonly clientesService: ClientesService,
        private readonly suscripcionesService: SuscripcionesService,
        private readonly bitacoraService: BitacoraService,
    ) { }

    async registrarEntrada(datos: RegistrarEntrada, usuarioSesion: any) {
        try {

            // Validar cliente
            const clienteExistente = await this.clientesService.obtenerClientePorUuId(datos.cliente_uuid);

            this.logger.log(`Registrando entrada: cliente ${clienteExistente.nombre}`);

            // Validar que el cliente esté activo
            if (clienteExistente.status !== 'activo')
                throw new InactiveClienteException(`${clienteExistente.nombre} ${clienteExistente.apellido}`);

            // Buscar suscripción vigente
            const suscripciones = await this.suscripcionesService.obtenerSuscripciones({
                cliente_id: clienteExistente.cliente_id,
                status: 'vigente',
            });
            const suscripcionVigente = suscripciones?.[0] ?? null;

            // Validar que tenga suscripción vigente
            if (!suscripcionVigente)
                throw new SinSuscripcionVigenteException(`${clienteExistente.nombre} ${clienteExistente.apellido}`);

            // Validar que no tenga una asistencia activa hoy
            const asistenciaEnCurso = await this.asistenciasService.obtenerAsistenciaActivaHoy(clienteExistente.cliente_id);

            if (asistenciaEnCurso)
                throw new AsistenciaEnCursoException(`${clienteExistente.nombre} ${clienteExistente.apellido}`);

            // Registrar entrada
            const asistencia = await this.asistenciasService.registrarEntrada(
                { ...datos, usuario_creacion: usuarioSesion.usuario_id },
                clienteExistente,
                suscripcionVigente,
            );

            // Bitácora
            await this.bitacoraService.agregarBitacora({
                usuario_id: usuarioSesion.usuario_id,
                usuario_nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido}`,
                modulo: 'asistencias',
                modulo_id: asistencia.asistencia_id,
                accion: 'crear',
                descripcion: `Entrada registrada: ${clienteExistente.nombre} ${clienteExistente.apellido} | método: ${datos.metodo_acceso}`,
            });

            return {
                success: true,
                message: 'Entrada registrada exitosamente',
                data: { asistencia },
            };
        } catch (error) {
            this.logger.error('Error en registrarEntrada coordinator', error);
            throw error;
        }
    }

    async registrarSalida(clienteUuid: string, usuarioSesion: any) {
        try {
            this.logger.log(`Registrando salida: cliente UUID ${clienteUuid}`);

            // 1. Resolver cliente
            const clienteExistente = await this.clientesService.obtenerClientePorUuId(clienteUuid);

            // 2. Buscar asistencia activa hoy
            const asistenciaActiva = await this.asistenciasService.obtenerAsistenciaActivaHoy(clienteExistente.cliente_id);
            if (!asistenciaActiva)
                throw new SinAsistenciaActivaException(`${clienteExistente.nombre} ${clienteExistente.apellido}`);

            // 3. Cerrar asistencia
            const asistenciaCerrada = await this.asistenciasService.registrarSalida(asistenciaActiva);

            // 4. Bitácora
            await this.bitacoraService.agregarBitacora({
                usuario_id: usuarioSesion.usuario_id,
                usuario_nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido}`,
                modulo: 'asistencias',
                modulo_id: asistenciaCerrada.asistencia_id,
                accion: 'actualizar',
                descripcion: `Salida registrada: ${clienteExistente.nombre} ${clienteExistente.apellido} | duración: ${asistenciaCerrada.duracion_minutos} min`,
            });

            return {
                success: true,
                message: 'Salida registrada exitosamente',
                data: { asistencia: asistenciaCerrada },
            };
        } catch (error) {
            this.logger.error('Error en registrarSalida coordinator', error);
            throw error;
        }
    }
}