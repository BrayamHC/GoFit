import { Controller, Get, Post, Query, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MembresiasService } from './membresias.service';
import { MembresiasCoordinator } from './membresias.coordinator';
import { RequireGlobalSessionGuard } from '../../guards/require-global-session.guard';
import { CrearMembresiaDTO, FiltrosMembresiasDTO } from './dto/membresias.dto';

@Controller('membresias')
@UseGuards(RequireGlobalSessionGuard)
export class MembresiasController {
    constructor(
        private readonly membresiasService: MembresiasService,
        private readonly membresiasCoordinator: MembresiasCoordinator,
    ) { }

    @Get()
    async obtenerMembresias(@Query() filtros: FiltrosMembresiasDTO) {
        const membresias = await this.membresiasService.obtenerMembresias(filtros);
        return { success: true, data: membresias };
    }

    @Get(':id')
    async obtenerMembresiaPorId(@Param('id', ParseIntPipe) id: number) {
        const membresia = await this.membresiasService.obtenerMembresiaPorId(id);
        return { success: true, data: membresia };
    }

    @Post()
    async crearMembresia(@Body() body: CrearMembresiaDTO, @Request() req: any) {
        return await this.membresiasCoordinator.crearMembresia(body, req.user);
    }
}
