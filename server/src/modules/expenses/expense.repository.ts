import { IExpenseRepository } from './interfaces/IExpenseRepository';
import { CreateExpenseDTO, UpdateExpenseDTO } from './expense.dto';
import Expense, { IExpense } from './expense.model';
import { ExpenseType } from './expense-type.enum';
import { handleDatabaseError } from '@/util/handle-database-error';
import { ObjectId } from 'mongoose';
import { NotFoundError } from '@/types/errors';

export class ExpenseRepository implements IExpenseRepository {
  async createExpense(
    userId: ObjectId,
    expenseData: CreateExpenseDTO
  ): Promise<IExpense> {
    try {
      const expense = await Expense.create({ userId, ...expenseData });
      return expense;
    } catch (error) {
      handleDatabaseError(error, 'createExpense');
    }
  }

  async getExpenseById(id: string): Promise<IExpense> {
    try {
      const expense = await Expense.findById(id);
      if (!expense) throw new NotFoundError('Expense not found');
      return expense;
    } catch (error) {
      if (error instanceof NotFoundError) throw error; // Re-throw NotFoundError
      handleDatabaseError(error, 'getExpenseById');
    }
  }

  async deleteExpense(id: string): Promise<IExpense | undefined> {
    try {
      const expense = await Expense.findByIdAndDelete(id);
      if (!expense) throw new NotFoundError('Expense not found');
      return expense;
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        handleDatabaseError(error, 'getExpenseById');
      }
    }
  }

  async updateExpense(
    id: string,
    expenseData: UpdateExpenseDTO
  ): Promise<IExpense | undefined> {
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(id, expenseData, {
        new: true,
      });
      if (!updatedExpense)
        throw new NotFoundError(`Expense with ID ${id} not found`);
      return updatedExpense;
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        handleDatabaseError(error, 'getExpenseById');
      }
    }
  }

  getExpenseByUserId(userId: string): Promise<IExpense[]> {
    throw new Error('Method not implemented.');
  }

  findExpenses(filters: {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    type?: ExpenseType;
    minCost?: number;
    maxCost?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    expenses: IExpense[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    throw new Error('Method not implemented.');
  }
}
