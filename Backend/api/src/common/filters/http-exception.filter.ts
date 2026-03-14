import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Error interno del servidor';
        let errorCode = 'INTERNAL_ERROR';
        let errors: Array<{ campo: string; mensaje: string }> | undefined = undefined;

        // Si es HttpException (incluye nuestras custom exceptions)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                errorCode = responseObj.errorCode || 'HTTP_EXCEPTION';
                errors = responseObj.errors;
            } else {
                message = exceptionResponse as string;
            }
        }
        // Si es ValidationException (tiene formato especial)
        else if (exception instanceof ValidationException) {
            const responseData = exception.getResponse();
            message = (responseData as any).message;
            errorCode = (responseData as any).errorCode;
            errors = (responseData as any).errors;
            status = exception.getStatus();
        }
        // Error desconocido
        else if (exception instanceof Error) {
            message = exception.message;
        }

        // Formato estandarizado de respuesta
        const errorResponse: Record<string, any> = {
            success: false,
            statusCode: status,
            message,
            errorCode,
            timestamp: new Date().toISOString(),
        };

        // Agregar errors solo si existe
        if (errors) {
            errorResponse.errors = errors;
        }

        // 🔥 LOGGING MEJORADO (con stack trace en errores 500)
        if (status >= 500) {
            // Errores del servidor (500+) → ERROR con stack trace
            this.logger.error(
                `[${request.method}] ${request.url} - ${status} - ${message}`,
                exception instanceof Error ? exception.stack : '',
            );
        } else if (status >= 400) {
            // Errores del cliente (400-499) → WARN sin stack trace
            this.logger.warn(
                `[${request.method}] ${request.url} - ${status} - ${message}`,
            );
        } else {
            // Otros (200-399) → LOG
            this.logger.log(
                `[${request.method}] ${request.url} - ${status} - ${message}`,
            );
        }

        response.status(status).json(errorResponse);
    }
}
