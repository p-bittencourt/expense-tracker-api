import { ObjectId } from 'mongoose';
import { IUser } from '../user.model';

export interface IUserService {
  getUserExpenses(user: IUser): Promise<ObjectId[]>;
}
