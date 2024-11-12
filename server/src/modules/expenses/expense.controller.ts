import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';
import { NotFoundError, ValidationError } from '@/types/errors';

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

  getExpenseById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const expenseId = req.params.id;
      const expense = await this.expenseService.getExpenseById(expenseId);
      res.status(200).send(expense);
    } catch (error) {
      next(error);
    }
  };

  updateExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const expenseId = req.params.id;
      const expenseData = req.body;
      const updatedExpense = await this.expenseService.updateExpense(
        expenseId,
        expenseData
      );
      if (!updatedExpense) {
        return next(new NotFoundError('User not found'));
      }
      res.status(200).send(updatedExpense);
    } catch (error) {
      next(error);
    }
  };
}
