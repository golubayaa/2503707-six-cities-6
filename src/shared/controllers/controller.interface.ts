import { Router, Request, Response, NextFunction } from 'express';
import { Middleware } from '../middlewares/middleware.interface.js';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[]; 
}

export interface Controller {
  router: Router;
}