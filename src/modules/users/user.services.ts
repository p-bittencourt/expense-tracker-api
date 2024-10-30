import { UserRepository } from './user.repository';
import type { IUser } from './user.model';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }
}
