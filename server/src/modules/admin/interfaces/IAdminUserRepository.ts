import { FilterQuery } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../../users/user.dto';
import { IUser } from '../../users/user.model';

export interface IAdminUserRepository {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  createUser(userData: CreateUserDTO): Promise<IUser>;
  deleteUser(id: string): Promise<IUser>;
  updateUser(id: string, userData: UpdateUserDTO): Promise<IUser>;
  findOne(query: FilterQuery<IUser>): Promise<IUser | null>;
}
