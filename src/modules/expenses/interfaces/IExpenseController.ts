import { Request, Response, NextFunction } from 'express';

export interface IExpenseController {
  createExpense(req: Request, res: Response, next: NextFunction): Promise<void>;
}
