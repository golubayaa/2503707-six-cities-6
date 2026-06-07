import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../libs/JWT/jwt-token.service.js';
import { StatusCodes } from 'http-status-codes';
export class AuthGuardMiddleware {
  constructor(private readonly jwtService: JwtTokenService) {}

  public execute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookieToken = (req as any).cookies?.token as string | undefined;
      const authHeader = req.headers.authorization;
      const tokenHeader = req.headers['x-token'];

      const token = cookieToken ?? (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : typeof tokenHeader === 'string' ? tokenHeader : undefined);

      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Missing or invalid authorization token' });
        return;
      }

      const payload = await this.jwtService.verifyToken(token);

      if (!payload) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
        return;
      }

      req.user = payload;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}
