import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../logger/index.js';
import { ExceptionFilter } from './exception-filter.interface.js';
import { HttpError } from './http-error.js';

export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      this._handleHttpError(error, res);
    } else {
      this._handleServerError(error, res);
    }
  }

  private _handleHttpError(error: HttpError, res: Response): void {
    this.logger.error(
      `HTTP Error: ${error.httpStatusCode} - ${error.message}`,
      error
    );

    res.status(error.httpStatusCode).json({
      statusCode: error.httpStatusCode,
      message: error.message,
      ...(error.detail && { detail: error.detail }),
    });
  }

  private _handleServerError(error: Error, res: Response): void {
    this.logger.error(`Server Error: ${error.message}`, error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    });
  }
}
