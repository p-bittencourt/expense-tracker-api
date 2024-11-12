import { ObjectId } from 'mongoose';
import { UserRepository } from '../users/user.repository';
import { CreateExpenseDTO, ExpenseResponseDTO } from './expense.dto';
import { IExpense } from './expense.model';
import { ExpenseRepository } from './expense.repository';
import { IExpenseService } from './interfaces/IExpenseService';

export class ExpenseService implements IExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  async createExpense(
    userId: ObjectId,
    expenseData: CreateExpenseDTO
  ): Promise<ExpenseResponseDTO | null> {
    const expense = await this.expenseRepository.createExpense(
      userId,
      expenseData
    );
    const updatedUser = await this.userRepository.addExpenseToUser(
      userId,
      expense.id
    );
    console.log(updatedUser);
    console.log(expense);
    return new ExpenseResponseDTO(expense);
  }
}
