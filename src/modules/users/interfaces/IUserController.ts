import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getSingleUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  editUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}
