import { UserController } from '@/modules/users/user.controller';
import { UserService } from '@/modules/users/user.service';
import { UserRepository } from '@/modules/users/user.repository';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { ExpenseService } from '@/modules/expenses/expense.service';
import { ExpenseRepository } from '@/modules/expenses/expense.repository';
import { AdminUserController } from '@/modules/admin/admin.controller';
import { AdminUserService } from '@/modules/admin/admin.service';
import { AdminUserRepository } from '@/modules/admin/admin.repository';

export function initializeDependencies() {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const expenseRepository = new ExpenseRepository();
  const expenseService = new ExpenseService(expenseRepository, userRepository);
  const expenseController = new ExpenseController(expenseService);
  const adminUserRepository = new AdminUserRepository();
  const adminUserService = new AdminUserService(adminUserRepository);
  const adminUserController = new AdminUserController(adminUserService);

  return {
    adminUserController,
    adminUserService,
    userController,
    expenseController,
  };
}
