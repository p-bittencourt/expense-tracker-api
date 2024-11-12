import { ObjectId } from 'mongoose';
import { ExpenseType } from '../expense-type.enum';
import { CreateExpenseDTO, UpdateExpenseDTO } from '../expense.dto';
import { IExpense } from '../expense.model';

export interface IExpenseRepository {
  // CRUD operations
  createExpense(
    userId: ObjectId,
    expenseData: CreateExpenseDTO
  ): Promise<IExpense>;
  getExpenseById(id: string): Promise<IExpense | undefined>;
  deleteExpense(id: string): Promise<IExpense>;
  updateExpense(
    id: string,
    expenseData: UpdateExpenseDTO
  ): Promise<IExpense | undefined>;

  // User-specific queries
  getExpenseByUserId(userId: string): Promise<IExpense[]>;

  // Filtering and pagination
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
  }>;

  // Aggregation methods

  // Monthly summaries
}
