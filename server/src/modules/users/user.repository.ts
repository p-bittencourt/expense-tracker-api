import { IUserRepository } from './interfaces/IUserRepository';
import User, { IUser } from './user.model';
import { NotFoundError } from '@/types/errors';
import { handleDatabaseError } from '@/util/handle-database-error';

export class UserRepository implements IUserRepository {
  async getCurrentUser(auth0Id: string): Promise<IUser> {
    try {
      const user = await User.findOne({ auth0Id: auth0Id });
      if (!user) throw new NotFoundError('User not found');
      return user;
    } catch (error) {
      handleDatabaseError(error, 'getCurrentUser');
    }
  }

  // TODO: this needs much testing after fixing relation mongodb user / auth user
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
