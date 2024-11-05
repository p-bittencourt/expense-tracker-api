import { IUser } from '../user.model';
import { CreateUserDTO, UserResponseDTO } from '../user.dto';

export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<IUser>;
  createUser(userData: CreateUserDTO): Promise<UserResponseDTO>;
  deleteUser(id: string): Promise<UserResponseDTO>;
  editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser>;
}
