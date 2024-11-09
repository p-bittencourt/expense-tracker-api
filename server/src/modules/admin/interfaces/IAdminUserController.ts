import { Request, Response, NextFunction } from 'express';

export interface IAdminUserController {
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
