import { CreateUserDTO } from '../user.dto';
import { IUser } from '../user.model';

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser>;
  createUser(userData: CreateUserDTO): Promise<IUser>;
  editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser>;
  deleteUser(id: string): Promise<void>;
}
