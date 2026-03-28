import { Controller, Get, Post, Patch, Query, Param, Body, Request, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RequireGlobalSessionGuard } from '../../guards/require-global-session.guard';
import {
    CrearUsuarioDTO,
    EditarUsuarioDTO,
    CambiarStatusUsuarioDTO,
    FiltrosUsuariosDTO,
} from './dto/usuarios.dto';

@Controller('usuarios')
@UseGuards(RequireGlobalSessionGuard)
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) { }

    @Get()
    async obtenerUsuarios(@Query() filtros: FiltrosUsuariosDTO) {
        const usuarios = await this.usuariosService.obtenerUsuarios(filtros);
        return { success: true, data: usuarios };
    }

    @Get(':uuid')
    async obtenerUsuarioPorUuid(@Param('uuid') uuid: string) {
        const usuario = await this.usuariosService.obtenerUsuarioPorUuid(uuid);
        return { success: true, data: usuario };
    }

    @Post()
    async crearUsuario(@Body() body: CrearUsuarioDTO, @Request() req: any) {
        const usuario = await this.usuariosService.crearUsuario(body, req.user);
        return { success: true, message: 'Usuario creado exitosamente', data: usuario };
    }

    @Patch(':uuid')
    async editarUsuario(@Param('uuid') uuid: string, @Body() body: EditarUsuarioDTO, @Request() req: any) {
        const usuario = await this.usuariosService.editarUsuario(uuid, body, req.user);
        return { success: true, message: 'Usuario actualizado exitosamente', data: usuario };
    }

    @Patch(':uuid/status')
    async cambiarStatus(@Param('uuid') uuid: string, @Body() body: CambiarStatusUsuarioDTO, @Request() req: any) {
        const usuario = await this.usuariosService.cambiarStatus(uuid, body.status, req.user);
        return { success: true, message: 'Status actualizado exitosamente', data: usuario };
    }
}
