import { Controller, Get, Post, Query, Body, Request, UseGuards, Patch } from "@nestjs/common";


@Controller('usuarios')

export class UsuariosController{
    constructor(){}

        @Get('')
        async obtenerUsuariosGlobales(@Request() req: any) {
        // const usuarios = await this.despachoService.obtenerUsuariosGlobales();
        // return { usuarios };
    }
}

