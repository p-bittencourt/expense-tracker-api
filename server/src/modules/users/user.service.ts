import { UserRepository } from './user.repository';
import { IUserService } from './interfaces/IUserServices';
import { UserResponseDTO } from './user.dto';
import { IUser } from './user.model';
import { ObjectId } from 'mongoose';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async getUserExpenses(user: IUser): Promise<ObjectId[]> {
    const populatedUser = await this.userRepository.getUserExpenses(user);
    return populatedUser.expenses;
  }
}
