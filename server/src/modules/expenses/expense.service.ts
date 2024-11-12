import { ObjectId } from 'mongoose';
import { UserRepository } from '../users/user.repository';
import {
  CreateExpenseDTO,
  ExpenseResponseDTO,
  UpdateExpenseDTO,
} from './expense.dto';
import { IExpense } from './expense.model';
import { ExpenseRepository } from './expense.repository';
import { IExpenseService } from './interfaces/IExpenseService';
import { IUser } from '../users/user.model';

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
    return new ExpenseResponseDTO(expense);
  }

  async getExpenseById(id: string): Promise<ExpenseResponseDTO> {
    const expense = await this.expenseRepository.getExpenseById(id);
    return new ExpenseResponseDTO(expense);
  }

  async updateExpense(
    id: string,
    expenseData: UpdateExpenseDTO
  ): Promise<ExpenseResponseDTO | null> {
    const expense = await this.expenseRepository.updateExpense(id, expenseData);
    if (!expense) return null;
    return new ExpenseResponseDTO(expense);
  }

  async deleteExpense(
    user: IUser,
    expenseId: string
  ): Promise<ExpenseResponseDTO> {
    const expense = await this.expenseRepository.deleteExpense(expenseId);
    const updatedUser = await this.userRepository.removeExpenseFromUser(
      user,
      expenseId
    );
    return new ExpenseResponseDTO(expense);
  }
}
