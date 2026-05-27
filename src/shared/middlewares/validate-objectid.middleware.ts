import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { isValidObjectId } from 'mongoose'; // или используйте свою функцию валидации
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private paramName: string) {}

  execute(req: Request, res: Response, next: NextFunction): void {
    const id = req.params[this.paramName];
    if (!isValidObjectId(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid ID format for param: ${this.paramName}` });
      return;
    }
    next();
  }
}
