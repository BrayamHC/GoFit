import { Controller, Get, Post, Query, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ClientesService }     from '../services/clientes.service';
import { ClientesCoordinator } from '../coordinators/clientes.coordinator';
import { RequireGlobalSessionGuard } from '../guards/require-global-session.guard';
import { validar, CrearClienteSchema } from '../utils/validator';

@Controller('Clientes')
@UseGuards(RequireGlobalSessionGuard)
export class ClientesController {
    constructor(
        private readonly clientesService:     ClientesService,
        private readonly clientesCoordinator: ClientesCoordinator,
    ) {}

    @Get()
    async obtenerClientes(@Query() filtros: any) {
        const clientes = await this.clientesService.obtenerClientes(filtros);
        return { success: true, data: clientes };
    }

    @Get(':id')
    async obtenerClientePorId(@Param('id', ParseIntPipe) id: number) {
        const cliente = await this.clientesService.obtenerClientePorId(id);
        return { success: true, data: cliente };
    }

    @Post()
    async crearCliente(@Body() data: any, @Request() req: any) {
        const datosValidados = validar(CrearClienteSchema, data);
        return await this.clientesCoordinator.crearCliente(datosValidados, req.user);
    }
}
