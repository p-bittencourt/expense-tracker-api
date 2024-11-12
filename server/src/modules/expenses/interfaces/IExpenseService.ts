import { ObjectId } from 'mongoose';
import { CreateExpenseDTO, ExpenseResponseDTO } from '../expense.dto';
import { IExpense } from '../expense.model';

export interface IExpenseService {
  createExpense(
    userId: ObjectId,
    expenseData: CreateExpenseDTO
  ): Promise<ExpenseResponseDTO | null>;
}
