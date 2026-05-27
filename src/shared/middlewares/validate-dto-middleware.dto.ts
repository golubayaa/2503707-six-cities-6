import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export class ValidateDtoMiddleware<T extends object> implements Middleware {
  constructor(private dtoClass: new () => T) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToClass(this.dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const validationErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: validationErrors,
      });
      return;
    }

    req.body = dtoInstance;
    next();
  }
}