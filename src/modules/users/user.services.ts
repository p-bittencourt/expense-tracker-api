import { UserRepository } from './user.repository';
import type { IUser } from './user.model';
import { CreateUserDTO } from './user.dto';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async createUser(userData: CreateUserDTO): Promise<IUser | null> {
    const user = await this.userRepository.createUser(userData);
    if (!user) {
      return null;
    }
    return user;
  }
}
