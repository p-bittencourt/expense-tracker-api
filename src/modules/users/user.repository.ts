import { CreateUserDTO } from './user.dto';
import User, { IUser } from './user.model';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async createUser(userData: CreateUserDTO): Promise<IUser | null> {
    const newUser = await User.create({ ...userData, expenses: [] });
    return newUser;
  }
}
