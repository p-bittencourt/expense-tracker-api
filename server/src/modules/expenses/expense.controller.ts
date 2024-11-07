import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';

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
      const expense = await this.expenseService.createExpense(
        req.body,
        req.params.userId
      );
      res.status(201).send(expense);
    } catch (error) {
      next(error);
    }
  };
}
