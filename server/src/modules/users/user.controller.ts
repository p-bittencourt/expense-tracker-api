import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { IUserController } from './interfaces/IUserController';
import { UnauthorizedError } from '@/types/errors';

export class UserController implements IUserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.headers);
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id: string = req.params.id;
      const user = await this.userService.getUserById(id);
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

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      res.status(200).json({
        user,
        message: 'User successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  };

  editUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.userService.editUser(req.params.id, req.body);
      res.status(200).json({
        user,
        message: 'User succsessfully edited',
      });
    } catch (error) {
      next(error);
    }
  };

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
      const user = await this.userService.findByAuth0Id(auth0User.sub);
      if (!user) {
        return next(new UnauthorizedError('User not found'));
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
