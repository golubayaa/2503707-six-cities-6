import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Route } from './controller.interface.js';

export abstract class BaseController {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  protected registerRoute(route: Route) {
    const middlewares = route.middlewares?.map((mw) =>
      mw.execute.bind(mw)
    ) ?? [];
    this.router[route.method](route.path, ...middlewares, route.handler);
  }

  protected sendOk(res: Response, data: unknown): void {
    res.status(StatusCodes.OK).json(data);
  }

  protected sendCreated(res: Response, data: unknown): void {
    res.status(StatusCodes.CREATED).json(data);
  }

  protected sendNoContent(res: Response): void {
    res.status(StatusCodes.NO_CONTENT).send();
  }

  protected sendBadRequest(res: Response, message: string): void {
    res.status(StatusCodes.BAD_REQUEST).json({ message });
  }

  protected sendUnauthorized(res: Response, message: string): void {
    res.status(StatusCodes.UNAUTHORIZED).json({ message });
  }

  protected sendForbidden(res: Response, message: string): void {
    res.status(StatusCodes.FORBIDDEN).json({ message });
  }

  protected sendNotFound(res: Response, message: string): void {
    res.status(StatusCodes.NOT_FOUND).json({ message });
  }

  protected sendConflict(res: Response, message: string): void {
    res.status(StatusCodes.CONFLICT).json({ message });
  }

  protected sendInternalServerError(res: Response, message: string): void {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message });
  }
}
