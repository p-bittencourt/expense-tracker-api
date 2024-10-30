import User, { IUser } from './user.model';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }
}
