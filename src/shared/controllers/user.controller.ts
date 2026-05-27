import { Router, Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController, Controller } from './index.js';
import asyncHandler from 'express-async-handler';

@injectable()
export class UserController extends BaseController implements Controller {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this._registerRoutes();
  }

  private _registerRoutes(): void {
    this.router.post(
      '/registration',
      asyncHandler((req: Request, res: Response) => this.create(req, res))
    );

    this.router.post(
      '/login',
      asyncHandler((req: Request, res: Response) => this.login(req, res))
    );

    this.router.post(
      '/logout',
      asyncHandler((req: Request, res: Response) => this.logout(req, res))
    );

    this.router.get(
      '/profile',
      asyncHandler((req: Request, res: Response) => this.getProfile(req, res))
    );
  }

  public create(req: Request, res: Response): void {
    const { name, email, avatarPath, type, password } = req.body;

    // Mock response - replace with actual service call
    const user = {
      name,
      email,
      avatarPath,
      type,
    };

    this.sendCreated(res, user);
  }

  public login(req: Request, res: Response): void {
    const { email, password } = req.body;

    // Mock response - replace with actual service call
    const response = {
      token: 'mock-jwt-token',
    };

    this.sendOk(res, response);
  }

  public logout(req: Request, res: Response): void {
    // Mock response
    this.sendOk(res, { message: 'Logged out successfully' });
  }

  public getProfile(req: Request, res: Response): void {
    // Mock response - in real app, get from authenticated user
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      avatarPath: '/avatars/john.jpg',
      type: 'ordinary',
    };

    this.sendOk(res, user);
  }
}
