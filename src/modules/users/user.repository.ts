import { IUserRepository } from './interfaces/IUserRepository';
import { CreateUserDTO, UserResponseDTO } from './user.dto';
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
      handleDatabaseError(error, 'getUserId');
    }
  }

  async createUser(userData: CreateUserDTO): Promise<UserResponseDTO> {
    try {
      const newUser = await User.create({ ...userData, expenses: [] });
      return new UserResponseDTO(newUser);
    } catch (error) {
      handleDatabaseError(error, 'createUser');
    }
  }

  async deleteUser(id: string): Promise<UserResponseDTO> {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new NotFoundError(`User not found`);
      return new UserResponseDTO(user);
    } catch (error) {
      handleDatabaseError(error, 'deleteUser');
    }
  }

  async editUser(id: string, userData: Partial<CreateUserDTO>): Promise<IUser> {
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
