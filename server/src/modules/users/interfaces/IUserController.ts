import { Request, Response, NextFunction } from 'express';

export interface IUserController {
  home(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserExpenses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
