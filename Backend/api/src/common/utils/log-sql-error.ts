// src/common/utils/log-sql-error.ts
import { Logger } from '@nestjs/common';

export function logSqlError(logger: Logger, operation: string, error: any) {
    logger.error(`Error en ${operation}: ${error.message}`, error.stack);

    // Detalles específicos de PostgreSQL
    if (error.code) {
        logger.error(`→ Código SQL: ${error.code}`);
    }
    if (error.detail) {
        logger.error(`→ Detalle: ${error.detail}`);
    }
    if (error.constraint) {
        logger.error(`→ Constraint: ${error.constraint}`);
    }
    if (error.column) {
        logger.error(`→ Columna: ${error.column}`);
    }
    if (error.table) {
        logger.error(`→ Tabla: ${error.table}`);
    }
}
