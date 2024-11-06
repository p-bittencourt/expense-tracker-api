import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';

export class ExpenseController implements IExpenseController {
  constructor(private expenseService: ExpenseService) {}

  async sayHi(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.status(200).send({ message: 'hi' });
  }

  async createExpense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const expense = await this.expenseService.createExpense(
        req.body,
        req.params.id
      );
      res.status(201).send(expense);
    } catch (error) {
      next(error);
    }
  }
}
