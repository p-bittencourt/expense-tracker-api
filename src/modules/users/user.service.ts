import { UserRepository } from './user.repository';
import type { IUser } from './user.model';
import { CreateUserDTO } from './user.dto';
import { IUserService } from './interfaces/IUserServices';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser> {
    return await this.userRepository.findById(id);
  }

  async createUser(userData: CreateUserDTO): Promise<IUser> {
    return await this.userRepository.createUser(userData);
  }

  async deleteUser(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateUser(
    id: string,
    userData: Partial<CreateUserDTO>
  ): Promise<IUser> {
    throw new Error('Method not implemented.');
  }
}