/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMsg: string = 'Internal server error';

    // Handle HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const original = exception.getResponse();
      errorMsg =
        typeof original === 'string'
          ? original
          : (original as any).message || JSON.stringify(original);
    }

    // Handle SQLite errors
    else if (
      exception instanceof QueryFailedError ||
      exception instanceof EntityNotFoundError ||
      exception instanceof CannotCreateEntityIdMapError ||
      exception.name.toUpperCase().includes('SQLITE')
    ) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMsg = 'Database error';
    }

    // Handle Throttler exceptions
    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      errorMsg = 'Too many requests. Please try again later.';
    }

    // Log server errors
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${request.method} ${request.url} - ${errorMsg}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message: `Quoteosch: ${errorMsg}`,
    });
  }
}
