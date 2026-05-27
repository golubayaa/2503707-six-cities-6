import { Router, Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';
import { ValidateObjectIdMiddleware } from '../middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middlewares/validate-dto-middleware.dto.js';
import { CreateCommentDto } from '../modules/comment/dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController implements Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this._registerRoutes();
  }

  private _registerRoutes(): void {
    const validateObjectId = new ValidateObjectIdMiddleware('offerId');
    const validateCreateCommentDto = new ValidateDtoMiddleware(CreateCommentDto);

    this.registerRoute({
      path: '/offers/:offerId/comments',
      method: 'get',
      handler: asyncHandler((req: Request, res: Response) => this.index(req, res)),
      middlewares: [validateObjectId],
    });

    this.registerRoute({
      path: '/offers/:offerId/comments',
      method: 'post',
      handler: asyncHandler((req: Request, res: Response) => this.create(req, res)),
      middlewares: [validateObjectId, validateCreateCommentDto],
    });
  }

  public index(req: Request, res: Response): void {
    // Мок: возвращаем массив до 50 последних комментариев
    const comments = [
      {
        id: '1',
        text: 'Great offer!',
        createdAt: new Date().toISOString(),
        rating: 5,
        author: {
          name: 'Alice',
          email: 'alice@mail.com',
          type: 'ordinary',
        },
      },
    ];
    this.sendOk(res, comments);
  }

  public create(req: Request, res: Response): void {
    const { offerId } = req.params;
    const { text, rating } = req.body;

    // Мок: возвращаем созданный комментарий
    const comment = {
      id: '2',
      text,
      createdAt: new Date().toISOString(),
      rating,
      author: {
        name: 'Anonymous',
        email: 'anon@example.com',
        type: 'ordinary',
      },
    };
    this.sendCreated(res, comment);
  }
}