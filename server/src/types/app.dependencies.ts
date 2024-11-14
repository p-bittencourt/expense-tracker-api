import { AdminUserController } from '@/modules/admin/admin.controller';
import { AdminUserRepository } from '@/modules/admin/admin.repository';
import { AdminUserService } from '@/modules/admin/admin.service';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { ExpenseService } from '@/modules/expenses/expense.service';
import { UserController } from '@/modules/users/user.controller';
import { UserService } from '@/modules/users/user.service';
import { RequestHandler } from 'express';

export interface AppDependencies {
  repositories: {
    adminUser: AdminUserRepository;
  };
  services: {
    adminUser: AdminUserService;
    user: UserService;
    expense: ExpenseService;
  };
  controllers: {
    adminUser: AdminUserController;
    user: UserController;
    expense: ExpenseController;
  };
  middleware?: {
    auth?: () => RequestHandler;
    checkUserRole?: () => RequestHandler;
    attachCurrentUser?: () => RequestHandler;
  };
}
