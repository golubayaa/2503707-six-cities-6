// src/shared/controllers/user.controller.ts
import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';
import { ValidateObjectIdMiddleware, ValidateDtoMiddleware, DocumentExistsMiddleware } from '../middlewares/index.js';
import { CreateUserDto } from '../modules/user/dto/create-user.dto.js';
import { LoginUserDto } from '../modules/user/dto/login-user.dto.js';
import { Component } from '../types/index.js';
import { UserService } from '../modules/user/user-service.interface.js';
import { Config, RestSchema } from '../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware.js';

@injectable()
export class UserController extends BaseController implements Controller {
  public router: Router;
  private readonly avatarUpload: FileUploadMiddleware;

  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super();
    this.router = Router();

    this.avatarUpload = FileUploadMiddleware.forAvatar(this.config.get('UPLOAD_PATH'));

    this._registerRoutes();
  }

  private _registerRoutes(): void {
    const validateObjectId = new ValidateObjectIdMiddleware('userId');
    const validateCreateUserDto = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginUserDto = new ValidateDtoMiddleware(LoginUserDto);
    const checkUserExists = new DocumentExistsMiddleware('userId', this.userService);

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
      middlewares: [validateObjectId, checkUserExists],
    });

    this.registerRoute({
      path: '/profile',
      method: 'get',
      handler: asyncHandler((req, res) => this.show(req, res)),
      middlewares: [validateObjectId, checkUserExists],
    });

    this.registerRoute({
      path: '/:userId/avatar',
      method: 'post',
      handler: asyncHandler((req, res) => this.uploadAvatar(req, res)),
      middlewares: [
        validateObjectId,
        checkUserExists,
        this.avatarUpload,
      ],
    });
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const filename = req.file!.filename;

    const updatedUser = await this.userService.updateAvatar(userId as string, filename);

    const avatarUrl = `/static/avatars/${filename}`;

    this.sendCreated(res, {
      message: 'Avatar uploaded successfully',
      avatarUrl,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { name, email, avatarPath, type, password } = req.body;
    const user = { name, email, avatarPath, type };
    this.sendCreated(res, user);
  }

  public async login(req: Request, res: Response): Promise<void> {
    this.sendOk(res, { token: 'mock-jwt-token' });
  }

  public async logout(req: Request, res: Response): Promise<void> {
    this.sendOk(res, { message: 'Logged out successfully' });
  }

  public async show(req: Request, res: Response): Promise<void> {
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatarPath: '/avatars/john.jpg',
      type: 'ordinary',
    };
    this.sendOk(res, user);
  }
}
