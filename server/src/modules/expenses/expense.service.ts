import User from '../users/user.model';
import { UserRepository } from '../users/user.repository';
import { CreateExpenseDTO } from './expense.dto';
import { IExpense } from './expense.model';
import { ExpenseRepository } from './expense.repository';
import { IExpenseService } from './interfaces/IExpenseService';

export class ExpenseService implements IExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  async createExpense(
    expenseData: CreateExpenseDTO,
    userId: string
  ): Promise<IExpense> {
    const expense = await this.expenseRepository.createExpense(
      expenseData,
      userId
    );

    await this.userRepository.addExpenseToUser(userId, expense.id.toString());

    return expense;
  }
}
