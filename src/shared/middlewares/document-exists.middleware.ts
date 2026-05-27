import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './index.js';

export interface DocumentExistsService {
  exists(id: string): Promise<boolean>;
}

export class DocumentExistsMiddleware implements Middleware {
  constructor(
    private paramName: string,
    private service: DocumentExistsService
  ) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params[this.paramName];
    if (!id || Array.isArray(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: `Parameter ${this.paramName} is required` });
      return;
    }

    const exists = await this.service.exists(id);
    if (!exists) {
      res.status(StatusCodes.NOT_FOUND).json({ message: `Resource with id ${id} not found` });
      return;
    }
    next();
  }
}
