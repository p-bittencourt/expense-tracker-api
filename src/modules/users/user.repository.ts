import { IUserRepository } from './interfaces/IUserRepository';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import User, { IUser } from './user.model';
import { ConflictError, DatabaseError, NotFoundError } from '@/types/errors';

export class UserRepository implements IUserRepository {
  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find().exec();
    } catch (error) {
      handleDatabaseError(error, 'getAllUsers');
    }
  }

  async getUserById(id: string): Promise<IUser> {
    try {
      const user = await User.findById(id).exec();
      if (!user) throw new NotFoundError(`User with ID ${id} not found`);
      return user;
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        handleDatabaseError(error, 'deleteUser');
      } else {
        throw error;
      }
    }
  }

  async createUser(userData: CreateUserDTO): Promise<IUser> {
    try {
      const newUser = await User.create({ ...userData, expenses: [] });
      return newUser;
    } catch (error) {
      handleDatabaseError(error, 'createUser');
    }
  }

  async deleteUser(id: string): Promise<IUser> {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new NotFoundError(`User not found`);
      return user;
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        handleDatabaseError(error, 'deleteUser');
      } else {
        throw error;
      }
    }
  }

  async editUser(id: string, userData: UpdateUserDTO): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(id, userData, { new: true });
      if (!user) throw new NotFoundError('User not found');
      return user;
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        handleDatabaseError(error, 'editUser');
      } else {
        throw error;
      }
    }
  }
}

function handleDatabaseError(error: any, operation: string): never {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern);
    throw new ConflictError(`A user with this ${field} already exists`);
  }
  // Log uknown error for debugging and monitoring
  console.error('Database error:', {
    operation,
    error: error.message,
    stack: error.stack,
  });

  throw new DatabaseError(`An error occurred during ${operation}`);
}
