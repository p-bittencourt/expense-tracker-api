import { UserRepository } from './user.repository';
import type { IUser } from './user.model';
import { CreateUserDTO } from './user.dto';

export class UserService {
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
}
