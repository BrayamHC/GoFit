import { EncodingDTO } from '../dto/registros-faciales.dto';

export class RegistrosFacialesRepoHelper {
    /**
     * El encoding se guarda como jsonb en Postgres.
     * Puede llegar como string o como array según el driver.
     * Normaliza siempre a number[].
     */
    static normalizarEncoding(row: any): EncodingDTO {
        return {
            cliente_uuid: row.cliente_uuid,
            encoding:
                typeof row.encoding === 'string'
                    ? JSON.parse(row.encoding)
                    : row.encoding,
        };
    }
}