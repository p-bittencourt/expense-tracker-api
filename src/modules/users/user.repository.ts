import { IUserRepository } from './interfaces/IUserRepository';
import { CreateUserDTO } from './user.dto';
import User, { IUser } from './user.model';
import { ConflictError, DatabaseError, NotFoundError } from '@/types/errors';

export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().exec();
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id).exec();
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);
    return user;
  }

  async createUser(userData: CreateUserDTO): Promise<IUser> {
    try {
      const newUser = await User.create({ ...userData, expenses: [] });
      return newUser;
    } catch (error: any) {
      handleDatabaseError(error, 'createUser');
    }
  }

  async editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser> {
    throw new Error('Method not implemented.');
  }

  async deleteUser(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

function handleDatabaseError(error: any, operation: string): never {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern);
    throw new ConflictError(`A user with this ${field} already exists`);
  }
  // Log uknown error for debugging and monitoring
  console.error('Database error:', {
    operation: 'createUser',
    error: error.message,
    stack: error.stack,
  });

  throw new DatabaseError(`An error occurred during ${operation}`);
}
