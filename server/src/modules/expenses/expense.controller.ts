import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';
import { NotFoundError } from '@/types/errors';

export class ExpenseController implements IExpenseController {
  constructor(private expenseService: ExpenseService) {}

  sayHi = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    res.status(201).send({ message: 'hi' });
  };

  createExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = res.locals.user._id;
      if (!userId) {
        return next(new NotFoundError('User not found'));
      }
      const expense = await this.expenseService.createExpense(userId, req.body);
      res.status(201).send(expense);
    } catch (error) {
      next(error);
    }
  };
}
