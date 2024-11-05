import { CreateUserDTO, UserResponseDTO } from '../user.dto';
import { IUser } from '../user.model';

export interface IUserRepository {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  createUser(userData: CreateUserDTO): Promise<UserResponseDTO>;
  deleteUser(id: string): Promise<UserResponseDTO>;
  editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser>;
}
