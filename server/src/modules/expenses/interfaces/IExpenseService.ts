import { ObjectId } from 'mongoose';
import { CreateExpenseDTO, ExpenseResponseDTO } from '../expense.dto';
import { IExpense } from '../expense.model';
import { IUser } from '@/modules/users/user.model';
import { UserResponseDTO } from '@/modules/users/user.dto';

export interface IExpenseService {
  createExpense(
    user: IUser,
    expenseData: CreateExpenseDTO
  ): Promise<{ expense: ExpenseResponseDTO; user: UserResponseDTO } | null>;
}
