import { ObjectId } from 'mongoose';
import { UserRepository } from '../users/user.repository';
import {
  CreateExpenseDTO,
  ExpenseResponseDTO,
  UpdateExpenseDTO,
} from './expense.dto';
import { ExpenseRepository } from './expense.repository';
import { IExpenseService } from './interfaces/IExpenseService';
import { IUser } from '../users/user.model';
import { UserResponseDTO } from '../users/user.dto';

interface FullExpenseResponse {
  expense: ExpenseResponseDTO;
  user: UserResponseDTO;
}

export class ExpenseService implements IExpenseService {
  constructor(
    private expenseRepository: ExpenseRepository,
    private userRepository: UserRepository
  ) {}

  // TODO: Implement some expense filtering
  async createExpense(
    user: IUser,
    expenseData: CreateExpenseDTO
  ): Promise<FullExpenseResponse> {
    const userId = user._id as unknown as ObjectId;
    const expense = await this.expenseRepository.createExpense(
      userId,
      expenseData
    );
    const updatedUser = await this.userRepository.addExpenseToUser(
      user,
      expense.id
    );
    return {
      expense: new ExpenseResponseDTO(expense),
      user: new UserResponseDTO(updatedUser),
    };
  }

  async getExpenseById(id: string): Promise<ExpenseResponseDTO> {
    const expense = await this.expenseRepository.getExpenseById(id);
    return new ExpenseResponseDTO(expense);
  }

  async updateExpense(
    id: string,
    expenseData: UpdateExpenseDTO
  ): Promise<ExpenseResponseDTO> {
    const expense = await this.expenseRepository.updateExpense(id, expenseData);
    return new ExpenseResponseDTO(expense);
  }

  async deleteExpense(
    user: IUser,
    expenseId: string
  ): Promise<FullExpenseResponse> {
    const expense = await this.expenseRepository.deleteExpense(expenseId);
    const updatedUser = await this.userRepository.removeExpenseFromUser(
      user,
      expenseId
    );
    return {
      expense: new ExpenseResponseDTO(expense),
      user: new UserResponseDTO(updatedUser),
    };
  }
}
