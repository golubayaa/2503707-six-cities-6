import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../libs/JWT/jwt-token.service.js';
import { StatusCodes } from 'http-status-codes';
export class AuthGuardMiddleware {
  constructor(private readonly jwtService: JwtTokenService) {}

  public execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid authorization header' });
      }

      const token = authHeader!.substring(7);
      const payload = await this.jwtService.verifyToken(token);

      if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
      }

      req.user = payload;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
