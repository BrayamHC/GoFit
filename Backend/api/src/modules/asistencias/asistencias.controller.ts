import { Controller, Get, Post, Patch, Body, Query, Param, Req } from '@nestjs/common';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasCoordinator } from './asistencias.coordinator';
import { FiltrosAsistenciasDTO, RegistrarEntradaDTO, AsistenciaUuidParamDTO } from './dto/asistencias.dto';

@Controller('asistencias')
export class AsistenciasController {
    constructor(
        private readonly asistenciasService: AsistenciasService,
        private readonly asistenciasCoordinator: AsistenciasCoordinator,
    ) { }

    @Get()
    async obtenerAsistencias(@Query() filtros: FiltrosAsistenciasDTO) {
        const { asistencias, total } = await this.asistenciasService.obtenerAsistencias(filtros);
        return {
            success: true,
            data: { asistencias },
            meta: {
                total,
                page: filtros.page,
                limit: filtros.limit,
                total_paginas: Math.ceil(total / filtros.limit),
            },
        };
    }

    @Post()
    async registrarEntrada(@Body() datos: RegistrarEntradaDTO, @Req() req: any) {
        return this.asistenciasCoordinator.registrarEntrada(datos, req.user);
    }

    @Patch(':uuid/salida')
    async registrarSalida(@Param() params: AsistenciaUuidParamDTO, @Req() req: any) {
        return this.asistenciasCoordinator.registrarSalida(params.uuid, req.user);
    }
}