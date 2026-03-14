import { HttpException, HttpStatus } from '@nestjs/common';

// Excepcion base para errores tecnicos
export class TechnicalException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        public readonly errorCode?: string,
    ) {
        super(
            {
                success: false,
                message,
                errorCode,
                timestamp: new Date().toISOString(),
            },
            statusCode,
        );
    }
}

// Error de conexion a BD
export class DatabaseConnectionException extends TechnicalException {
    constructor(message = 'Error de conexion a la base de datos') {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, 'DATABASE_CONNECTION_ERROR');
    }
}

// Error de query SQL
export class DatabaseQueryException extends TechnicalException {
    constructor(message = 'Error al ejecutar consulta en base de datos') {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'DATABASE_QUERY_ERROR');
    }
}

// Error de conexion a Redis
export class RedisConnectionException extends TechnicalException {
    constructor(message = 'Error de conexion a Redis') {
        super(message, HttpStatus.SERVICE_UNAVAILABLE, 'REDIS_CONNECTION_ERROR');
    }
}

// Error generico interno
export class InternalException extends TechnicalException {
    constructor(message = 'Error interno del servidor') {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_ERROR');
    }
}
