import { Controller, Get, Post, Query, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MembresiasService }     from '../services/membresias.service';
import { MembresiasCoordinator } from '../coordinators/membresias.coordinator';
import { RequireGlobalSessionGuard } from '../guards/require-global-session.guard';
import { validar, CrearMembresiaSchema } from '../utils/validator';

@Controller('Membresias')
@UseGuards(RequireGlobalSessionGuard)
export class MembresiasController {
    constructor(
        private readonly membresiasService:     MembresiasService,
        private readonly membresiasCoordinator: MembresiasCoordinator,
    ) {}

    @Get()
    async obtenerMembresias(@Query() filtros: any) {
        const membresias = await this.membresiasService.obtenerMembresias(filtros);
        return { success: true, data: membresias };
    }

    @Get(':id')
    async obtenerMembresiaPorId(@Param('id', ParseIntPipe) id: number) {
        const membresia = await this.membresiasService.obtenerMembresiaPorId(id);
        return { success: true, data: membresia };
    }

    @Post()
    async crearMembresia(@Body() data: any, @Request() req: any) {
        const datosValidados = validar(CrearMembresiaSchema, data);
        return await this.membresiasCoordinator.crearMembresia(datosValidados, req.user);
    }
}
