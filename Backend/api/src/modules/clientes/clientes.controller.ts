import { Controller, Get, Post, Query, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesCoordinator } from './clientes.coordinator';
import { RequireGlobalSessionGuard } from '../../guards/require-global-session.guard';
import { CrearClienteDTO, FiltrosClientesDTO } from './dto/clientes.dto';

@Controller('clientes')
@UseGuards(RequireGlobalSessionGuard)
export class ClientesController {
    constructor(
        private readonly clientesService: ClientesService,
        private readonly clientesCoordinator: ClientesCoordinator,
    ) { }

    @Get()
    async obtenerClientes(@Query() filtros: FiltrosClientesDTO) {
        const clientes = await this.clientesService.obtenerClientes(filtros);
        return { success: true, data: clientes };
    }

    @Get(':uuid')
    async obtenerClientePorUUId(@Param('uuid', ParseIntPipe) uuid: string) {
        const cliente = await this.clientesService.obtenerClientePorUuId(uuid);
        return { success: true, data: cliente };
    }

    @Post()
    async crearCliente(@Body() body: CrearClienteDTO, @Request() req: any) {
        return await this.clientesCoordinator.crearCliente(body, req.user);
    }
}
