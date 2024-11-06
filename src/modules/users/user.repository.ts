import { IUserRepository } from './interfaces/IUserRepository';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import User, { IUser } from './user.model';
import { NotFoundError } from '@/types/errors';
import { handleDatabaseError } from '@/util/handle-database-error';

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

  async addExpenseToUser(userId: string, expenseId: string): Promise<IUser> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { expenses: expenseId } },
        { new: true }
      );
      if (!user) throw new NotFoundError('User not found');
      return user;
    } catch (error) {
      handleDatabaseError(error, 'addExpenseToUser');
    }
  }
}
