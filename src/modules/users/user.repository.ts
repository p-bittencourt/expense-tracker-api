import { CreateUserDTO } from './user.dto';
import User, { IUser } from './user.model';
import { ConflictError, DatabaseError } from '@/types/errors';

export class UserRepository {
  async findAll(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).exec();
  }

  async createUser(userData: CreateUserDTO): Promise<IUser> {
    try {
      const newUser = await User.create({ ...userData, expenses: [] });
      return newUser;
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern[0]);
        throw new ConflictError(`A user with this ${field} already exists`);
      }

      // Log uknown error for debugging and monitoring
      console.error('Database error:', {
        operation: 'createUser',
        error: error.message,
        stack: error.stack,
      });

      throw new DatabaseError('An error occurred while creating the user');
    }
  }
}
