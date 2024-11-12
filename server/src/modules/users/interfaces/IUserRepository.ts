import { ObjectId } from 'mongoose';
import { IUser } from '../user.model';

export interface IUserRepository {
  addExpenseToUser(user: IUser, expenseId: ObjectId): Promise<IUser>;
  getUserExpenses(user: IUser): Promise<Omit<IUser, never>>;
}
