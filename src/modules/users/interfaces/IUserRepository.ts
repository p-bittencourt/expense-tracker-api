import { CreateUserDTO } from '../user.dto';
import { IUser } from '../user.model';

export interface IUserRepository {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  createUser(userData: CreateUserDTO): Promise<IUser>;
  deleteUser(id: string): Promise<void>;
  editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser>;
}
