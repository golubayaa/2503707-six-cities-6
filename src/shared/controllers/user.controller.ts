import { Router, Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';
import { ValidateObjectIdMiddleware } from '../middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../middlewares/validate-dto-middleware.dto.js';
import { CreateUserDto } from '../modules/user/dto/create-user.dto.js';
import { LoginUserDto } from '../modules/user/dto/login-user.dto.js';

@injectable()
export class UserController extends BaseController implements Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this._registerRoutes();
  }

  private _registerRoutes(): void {
    const validateObjectId = new ValidateObjectIdMiddleware('userId');
    const validateCreateUserDto = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginUserDto = new ValidateDtoMiddleware(LoginUserDto);

    this.registerRoute({
      path: '/',
      method: 'post',
      handler: asyncHandler((req, res) => this.create(req, res)),
      middlewares: [validateCreateUserDto],
    });

    this.registerRoute({
      path: '/login',
      method: 'post',
      handler: asyncHandler((req, res) => this.login(req, res)),
      middlewares: [validateLoginUserDto],
    });

    this.registerRoute({
      path: '/logout',
      method: 'post',
      handler: asyncHandler((req, res) => this.logout(req, res)),
      middlewares: [validateObjectId],
    });

    this.registerRoute({
      path: '/profile',
      method: 'get',
      handler: asyncHandler((req, res) => this.show(req, res)),
      middlewares: [validateObjectId],
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { name, email, avatarPath, type, password } = req.body;
    // Mock response
    const user = { name, email, avatarPath, type };
    this.sendCreated(res, user);
  }

  public async login(req: Request, res: Response): Promise<void> {
    // Mock response
    this.sendOk(res, { token: 'mock-jwt-token' });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    // Mock response
    this.sendOk(res, { message: 'Logged out successfully' });
  }

  public async show(req: Request, res: Response): Promise<void> {
    // Mock response
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatarPath: '/avatars/john.jpg',
      type: 'ordinary',
    };
    this.sendOk(res, user);
  }
}
