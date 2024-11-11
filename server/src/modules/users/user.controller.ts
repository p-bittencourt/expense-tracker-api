import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { IUserController } from './interfaces/IUserController';
import { UnauthorizedError } from '@/types/errors';

export class UserController implements IUserController {
  constructor(private userService: UserService) {}

  home = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = res.locals.user;
      if (user) {
        res.json(user);
        return;
      }
      res.json({
        message: 'No user data available',
      });
    } catch (error) {
      next(error);
    }
  };
}
