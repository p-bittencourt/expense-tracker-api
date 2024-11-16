import { AdminUserController } from '@/modules/admin/admin.controller';
import { AdminUserRepository } from '@/modules/admin/admin.repository';
import { AdminUserService } from '@/modules/admin/admin.service';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { ExpenseRepository } from '@/modules/expenses/expense.repository';
import { ExpenseService } from '@/modules/expenses/expense.service';
import { UserController } from '@/modules/users/user.controller';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.service';
import { AppDependencies } from '@/types/app.dependencies';

// Mock the UserRepository and UserService
jest.mock('@/modules/admin/admin.repository');
jest.mock('@/modules/admin/admin.service');
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.service');
jest.mock('@/modules/expenses/expense.repository');
jest.mock('@/modules/expenses/expense.service');
jest.mock('express-openid-connect', () => ({
  requiresAuth: () => (req: any, res: any, next: any) => next(),
  auth: () => (req: any, res: any, next: any) => next(),
}));

export function createTestDependencies(): AppDependencies {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockAdminUserRepository: jest.Mocked<AdminUserRepository>;
  let mockAdminUserService: jest.Mocked<AdminUserService>;
  let mockExpenseRepository: jest.Mocked<ExpenseRepository>;
  let mockExpenseService: jest.Mocked<ExpenseService>;
  let adminUserController: AdminUserController;
  let userController: UserController;
  let expenseController: ExpenseController;

  mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
  mockUserService = new UserService(
    mockUserRepository
  ) as jest.Mocked<UserService>;
  mockAdminUserRepository =
    new AdminUserRepository() as jest.Mocked<AdminUserRepository>;
  mockAdminUserService = new AdminUserService(
    mockAdminUserRepository
  ) as jest.Mocked<AdminUserService>;
  mockExpenseRepository =
    new ExpenseRepository() as jest.Mocked<ExpenseRepository>;
  mockExpenseService = new ExpenseService(
    mockExpenseRepository,
    mockUserRepository
  ) as jest.Mocked<ExpenseService>;
  adminUserController = new AdminUserController(mockAdminUserService);
  userController = new UserController(mockUserService);
  expenseController = new ExpenseController(mockExpenseService);

  return {
    repositories: {
      adminUser: mockAdminUserRepository,
    },
    services: {
      adminUser: mockAdminUserService,
      expense: mockExpenseService,
      user: mockUserService,
    },
    controllers: {
      adminUser: adminUserController,
      expense: expenseController,
      user: userController,
    },
  };
}
