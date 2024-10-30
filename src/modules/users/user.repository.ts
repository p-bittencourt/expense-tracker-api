import User from './user.model';
import type { IUser } from './user.model';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await User.find().exec();
  }
}
