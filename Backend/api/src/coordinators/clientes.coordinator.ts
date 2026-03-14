import { Injectable, Logger } from '@nestjs/common';
import { ClientesService }     from '../services/clientes.service';
import { SuscripcionesService } from '../services/suscripciones.service';
import { BitacoraService }     from '../services/bitacora.service';
import { DatabaseQueryException } from '../common/exceptions';

@Injectable()
export class ClientesCoordinator {
    private readonly logger = new Logger(ClientesCoordinator.name);

    constructor(
        private readonly clientesService:     ClientesService,
        private readonly suscripcionesService: SuscripcionesService,
        private readonly bitacoraService:     BitacoraService,
    ) {}

    async crearCliente(datos: any, usuarioSesion: any) {
        try {
            this.logger.log(`Creando cliente: ${datos.nombre} ${datos.apellido} por ${usuarioSesion.email}`);

            // 1. Crear cliente
            const clienteCreado = await this.clientesService.crearCliente({
                ...datos,
                usuario_creacion: usuarioSesion.usuario_id,
            });

            // 2. Crear suscripción si viene membresía
            let suscripcionCreada = null;

            if (datos.membresia_id) {
                suscripcionCreada = await this.suscripcionesService.crearSuscripcion({
                    cliente_id:       clienteCreado.cliente_id,
                    membresia_id:     datos.membresia_id,
                    usuario_creacion: usuarioSesion.usuario_id,
                });
            }

            // 3. Registrar en bitácora
            await this.bitacoraService.registrar({
                usuario_id:     usuarioSesion.usuario_id,
                usuario_nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido}`,
                modulo:         'clientes',
                modulo_id:      clienteCreado.cliente_id,
                accion:         'crear',
                descripcion:    `Cliente ${clienteCreado.nombre} ${clienteCreado.apellido} creado${suscripcionCreada ? ` con suscripción a membresía ID ${datos.membresia_id}` : ''}`,
            });

            return {
                success: true,
                message: 'Cliente creado exitosamente',
                data: {
                    cliente:      clienteCreado,
                    suscripcion:  suscripcionCreada,
                },
            };
        } catch (error) {
            this.logger.error('Error en crearCliente coordinator', error);
            throw error;
        }
    }
}
