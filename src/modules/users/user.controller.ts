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

  getSingleUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id: string = req.params.id;
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({
          message: 'User not found',
          status: 'not_found',
        });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  // TODO: unit test create user before implementing delete user
  // TODO: check that we can't create users without a mandatory field, or with an unexisting field
  // TODO: study how to use mongodb-memory-server before further testing of db operations
}
