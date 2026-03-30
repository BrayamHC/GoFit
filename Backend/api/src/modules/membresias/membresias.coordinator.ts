import { Injectable, Logger } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { BitacoraService } from '../bitacora/bitacora.service';

@Injectable()
export class MembresiasCoordinator {
    private readonly logger = new Logger(MembresiasCoordinator.name);

    constructor(
        private readonly membresiasService: MembresiasService,
        private readonly bitacoraService: BitacoraService,
    ) { }

    async crearMembresia(datos: any, usuarioSesion: any) {
        try {
            this.logger.log(`Creando membresía: ${datos.nombre}`);

            const membresiaCreada = await this.membresiasService.crearMembresia(datos, usuarioSesion);

            await this.bitacoraService.agregarBitacora({
                usuario_id: usuarioSesion.usuario_id,
                usuario_nombre: `${usuarioSesion.nombre} ${usuarioSesion.apellido}`,
                modulo: 'membresias',
                modulo_id: membresiaCreada.membresia_id,
                accion: 'crear',
                descripcion: `Membresía "${membresiaCreada.nombre}" creada — $${membresiaCreada.precio} ${membresiaCreada.moneda} / ${membresiaCreada.dias_duracion} días`,
            });

            return {
                success: true,
                message: 'Membresía creada exitosamente',
                data: membresiaCreada,
            };
        } catch (error) {
            this.logger.error('Error en crearMembresia coordinator', error);
            throw error;
        }
    }
}
