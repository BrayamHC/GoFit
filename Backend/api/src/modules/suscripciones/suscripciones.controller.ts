import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { RequireGlobalSessionGuard } from '../../guards/require-global-session.guard';
import { FiltrosSuscripcionesDTO } from './dto/suscripciones.dto';

@Controller('suscripciones')
@UseGuards(RequireGlobalSessionGuard)
export class SuscripcionesController {
    constructor(private readonly suscripcionesService: SuscripcionesService) { }

    @Get()
    async obtenerSuscripciones(@Query() filtros: FiltrosSuscripcionesDTO) {
        const suscripciones = await this.suscripcionesService.obtenerSuscripciones(filtros);
        return { success: true, data: suscripciones };
    }

    @Get(':id')
    async obtenerSuscripcionPorId(@Param('id', ParseIntPipe) id: number) {
        const suscripcion = await this.suscripcionesService.obtenerSuscripcionPorId(id);
        return { success: true, data: suscripcion };
    }

    @Get('cliente/:clienteId')
    async obtenerSuscripcionesPorCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
        const suscripciones = await this.suscripcionesService.obtenerSuscripcionesPorCliente(clienteId);
        return { success: true, data: suscripciones };
    }
}
