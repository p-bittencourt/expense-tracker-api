import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from './expense.service';
import { IExpenseController } from './interfaces/IExpenseController';
import { AppError, NotFoundError, ValidationError } from '@/types/errors';
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
      console.log('Debug - res.locals:', res.locals); // Add this
      const user: IUser = res.locals.user;
      if (!user) {
        console.log('Debug - No user found in res.locals'); // Add this
        throw new NotFoundError('User not found');
      }
      const result = await this.expenseService.createExpense(user, req.body);
      const { expense, user: updatedUser } = result;
      res.status(201).send({ expense, updatedUser });
    } catch (error) {
      console.log('Debug - Error caught:', error); // Add this
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
      const result = await this.expenseService.deleteExpense(user, expenseId);
      const { expense: deletedExpense, user: updatedUser } = result;
      res.status(200).send({ deletedExpense, updatedUser });
    } catch (error) {
      next(error);
    }
  };
}
