import { IExpenseRepository } from './interfaces/IExpenseRepository';
import { CreateExpenseDTO, UpdateExpenseDTO } from './expense.dto';
import Expense, { IExpense } from './expense.model';
import { ExpenseType } from './expense-type.enum';
import { handleDatabaseError } from '@/util/handle-database-error';

export class ExpenseRepository implements IExpenseRepository {
  async createExpense(
    expenseData: CreateExpenseDTO,
    userId: string
  ): Promise<IExpense> {
    try {
      const expense = await Expense.create({ userId, ...expenseData });
      return expense;
    } catch (error) {
      handleDatabaseError(error, 'createExpense');
    }
  }

  getExpenseById(id: string): Promise<IExpense> {
    throw new Error('Method not implemented.');
  }
  deleteExpense(id: string): Promise<IExpense> {
    throw new Error('Method not implemented.');
  }
  updateExpense(id: string, expenseData: UpdateExpenseDTO): Promise<IExpense> {
    throw new Error('Method not implemented.');
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
