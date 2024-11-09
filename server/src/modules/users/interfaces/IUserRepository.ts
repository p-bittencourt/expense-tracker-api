import { FilterQuery } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../user.dto';
import { IUser } from '../user.model';

export interface IUserRepository {
  //  getAllUsers(): Promise<IUser[]>;
  //  getUserById(id: string): Promise<IUser>;
  //  createUser(userData: CreateUserDTO): Promise<IUser>;
  //  deleteUser(id: string): Promise<IUser>;
  //  editUser(id: string, userData: UpdateUserDTO): Promise<IUser>;
  //  findOne(query: FilterQuery<IUser>): Promise<IUser | null>;

  addExpenseToUser(userId: string, expenseId: string): Promise<IUser>;

  // TODO: rename edit actions to update, to better fit industry standard
}
