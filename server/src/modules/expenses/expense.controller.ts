import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';
import { NotFoundError, ValidationError } from '@/types/errors';
import { IUser } from '../users/user.model';

export class ExpenseController implements IExpenseController {
  constructor(private expenseService: ExpenseService) {}

  // TODO: implement find expense by type

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
      const user: IUser = res.locals.user;
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const expense = await this.expenseService.createExpense(user, req.body);
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

  deleteExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const expenseId = req.params.id;
      const user: IUser = res.locals.user;
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const deletedExpense = await this.expenseService.deleteExpense(
        user,
        expenseId
      );
      res.status(200).send(deletedExpense);
    } catch (error) {
      next(error);
    }
  };
}
