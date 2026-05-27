import { Router, Request, Response, NextFunction } from 'express';

export interface Route {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  handler: (req: Request, res: Response, next: NextFunction) => void;
}

export interface Controller {
  router: Router;
}
