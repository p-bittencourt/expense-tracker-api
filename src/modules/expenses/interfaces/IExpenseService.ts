import { CreateExpenseDTO } from '../expense.dto';
import { IExpense } from '../expense.model';

export interface IExpenseService {
  createExpense(
    expenseData: CreateExpenseDTO,
    userId: string
  ): Promise<IExpense>;
}
