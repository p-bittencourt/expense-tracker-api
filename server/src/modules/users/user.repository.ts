import { ObjectId } from 'mongoose';
import { IUserRepository } from './interfaces/IUserRepository';
import User, { IUser } from './user.model';
import { NotFoundError } from '@/types/errors';
import { handleDatabaseError } from '@/util/handle-database-error';

export class UserRepository implements IUserRepository {
  // TODO: this needs much testing after fixing relation mongodb user / auth user
  async addExpenseToUser(
    userId: ObjectId,
    expenseId: ObjectId
  ): Promise<IUser> {
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
