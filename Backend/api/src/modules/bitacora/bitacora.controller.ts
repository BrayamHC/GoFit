import { Controller, Get, Query } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';
import { FiltrosBitacoraDTO } from './dto/bitacora.dto';

@Controller('bitacora')
export class BitacoraController {
    constructor(private readonly bitacoraService: BitacoraService) { }

    @Get()
    async obtenerBitacora(@Query() filtros: FiltrosBitacoraDTO) {
        return this.bitacoraService.obtenerBitacora(filtros);
    }
}