import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { IUserController } from './interfaces/IUserController';
import { UnauthorizedError } from '@/types/errors';

export class UserController implements IUserController {
  constructor(private userService: UserService) {}

  getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.oidc.isAuthenticated()) {
        return next(new UnauthorizedError('User not authenticated'));
      }

      const auth0User = req.oidc.user;
      if (!auth0User) {
        return next(new UnauthorizedError('Auth0 user data not available'));
      }

      const user = await this.userService.getCurrentUser(auth0User.sub);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
