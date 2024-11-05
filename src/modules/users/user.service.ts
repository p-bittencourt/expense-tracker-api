import { UserRepository } from './user.repository';
import type { IUser } from './user.model';
import { CreateUserDTO, UserResponseDTO } from './user.dto';
import { IUserService } from './interfaces/IUserServices';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<IUser> {
    return await this.userRepository.getUserById(id);
  }

  async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
    return await this.userRepository.createUser(userData);
  }

  async deleteUser(id: string): Promise<UserResponseDTO> {
    return await this.userRepository.deleteUser(id);
  }

  async editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
}
