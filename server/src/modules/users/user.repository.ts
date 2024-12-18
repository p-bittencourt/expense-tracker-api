import { ObjectId } from 'mongoose';
import { IUserRepository } from './interfaces/IUserRepository';
import User, { IUser } from './user.model';
import { NotFoundError } from '@/types/errors';
import { handleDatabaseError } from '@/util/handle-database-error';

export class UserRepository implements IUserRepository {
  async addExpenseToUser(user: IUser, expenseId: ObjectId): Promise<IUser> {
    try {
      user.expenses.push(expenseId);
      const updatedUser = await user.save();
      if (!updatedUser) throw new NotFoundError('User not found');
      return updatedUser;
    } catch (error) {
      handleDatabaseError(error, 'addExpenseToUser');
    }
  }

  async removeExpenseFromUser(user: IUser, expenseId: string): Promise<IUser> {
    try {
      user.expenses = user.expenses.filter(
        (expense) => expense.toString() !== expenseId
      );
      const updatedUser = await user.save();
      console.log(updatedUser);
      return updatedUser;
    } catch (error) {
      handleDatabaseError(error, 'removeExpenseFromUser');
    }
  }

  async getUserExpenses(user: IUser): Promise<Omit<IUser, never>> {
    try {
      const populatedUser = await user.populate('expenses');
      return populatedUser;
    } catch (error) {
      handleDatabaseError(error, 'getUserExpenses');
    }
  }
}
