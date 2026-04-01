import { Controller, Get, UseGuards } from '@nestjs/common';

import { RegistrosFacialesService } from './registros-faciales.service';
import { VisionGuard } from '../../guards/vision.guard';
import { EncodingDTO } from './dto/registros-faciales.dto';

@Controller('registros-faciales')
@UseGuards(VisionGuard)

export class RegistrosFacialesController {
    constructor(
        private readonly registrosFacialesService: RegistrosFacialesService,
    ) { }

    /**
     * GET /registros-faciales/encodings
     *
     * Endpoint consumido por FastAPI Vision al arrancar o al recargar su almacén.
     * - No requiere JWT de usuario (excluido del AuthMiddleware en app.module.ts)
     * - Protegido por VisionGuard (header x-vision-key)
     *
     * Retorna: [{ cliente_uuid, encoding }]
     */
    @Get('encodings')
    async obtenerEncodings(): Promise<EncodingDTO[]> {
        return this.registrosFacialesService.obtenerEncodings();
    }
}
