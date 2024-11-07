import { UserController } from '@/modules/users/user.controller';
import { UserService } from '@/modules/users/user.service';
import { UserRepository } from '@/modules/users/user.repository';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { ExpenseService } from '@/modules/expenses/expense.service';
import { ExpenseRepository } from '@/modules/expenses/expense.repository';

export function initializeDependencies() {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const expenseRepository = new ExpenseRepository();
  const expenseService = new ExpenseService(expenseRepository, userRepository);
  const expenseController = new ExpenseController(expenseService);

  return { userController, userService, expenseController };
}
