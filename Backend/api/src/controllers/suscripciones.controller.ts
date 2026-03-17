import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SuscripcionesService }     from '../services/suscripciones.service';
import { RequireGlobalSessionGuard } from '../guards/require-global-session.guard';

@Controller('Suscripciones')
@UseGuards(RequireGlobalSessionGuard)
export class SuscripcionesController {
    constructor(
        private readonly suscripcionesService:     SuscripcionesService,
    ) {}

    @Get()
    async obtenerSuscripciones(@Query() filtros: any) {
        const data = await this.suscripcionesService.obtenerSuscripciones(filtros);
        return { success: true, data };
    }

    @Get(':id')
    async obtenerSuscripcionPorId(@Param('id', ParseIntPipe) id: number) {
        const data = await this.suscripcionesService.obtenerSuscripcionPorId(id);
        return { success: true, data };
    }

    @Get('cliente/:clienteId')
    async obtenerPorCliente(@Param('clienteId', ParseIntPipe) clienteId: number) {
        const data = await this.suscripcionesService.obtenerSuscripcionesPorCliente(clienteId);
        return { success: true, data };
    }
}
