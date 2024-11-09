import {
  CreateUserDTO,
  UserResponseDTO,
  UpdateUserDTO,
} from '@/modules/users/user.dto';
import { IUser } from '@/modules/users/user.model';

export interface IAdminUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(id: string): Promise<UserResponseDTO>;
  getUserByEmail(email: string): Promise<UserResponseDTO | null>;
  getUserByName(name: string): Promise<UserResponseDTO | null>;
  getUserByAuth0Id(auth0Id: string): Promise<UserResponseDTO | null>;
  createUser(userData: CreateUserDTO): Promise<UserResponseDTO>;
  deleteUser(id: string): Promise<UserResponseDTO>;
  updateUser(id: string, userData: UpdateUserDTO): Promise<UserResponseDTO>;
}
