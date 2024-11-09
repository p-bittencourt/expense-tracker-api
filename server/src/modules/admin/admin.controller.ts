import { Request, Response, NextFunction } from 'express';
import { AdminUserService } from './admin.service';
import { IAdminUserController } from './interfaces/IAdminUserController';
import { NotFoundError, UnauthorizedError } from '@/types/errors';

// TODO: Rerun tests after implementing admin user
// Try adding a new non-admin user

export class AdminUserController implements IAdminUserController {
  constructor(private adminUserService: AdminUserService) {}

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.adminUserService.getAllUsers();
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
      const user = await this.adminUserService.getUserById(req.params.id);
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
      const user = await this.adminUserService.createUser(req.body);
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
      const user = await this.adminUserService.deleteUser(req.params.id);
      res.status(200).json({
        user,
        message: 'User successfully deleted',
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.adminUserService.updateUser(
        req.params.id,
        req.body
      );
      res.status(200).json({
        user,
        message: 'User successfully edited',
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

      const user = await this.adminUserService.getUserByAuth0Id(auth0User.sub);
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
