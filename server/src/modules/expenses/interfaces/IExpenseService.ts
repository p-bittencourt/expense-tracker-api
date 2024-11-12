import { ObjectId } from 'mongoose';
import { CreateExpenseDTO, ExpenseResponseDTO } from '../expense.dto';
import { IExpense } from '../expense.model';
import { IUser } from '@/modules/users/user.model';

export interface IExpenseService {
  createExpense(
    user: IUser,
    expenseData: CreateExpenseDTO
  ): Promise<ExpenseResponseDTO | null>;
}
