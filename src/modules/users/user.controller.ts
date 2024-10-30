import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.services';

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };
}
