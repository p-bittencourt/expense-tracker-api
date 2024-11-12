import { AdminUserController } from '@/modules/admin/admin.controller';
import { AdminUserRepository } from '@/modules/admin/admin.repository';
import { AdminUserService } from '@/modules/admin/admin.service';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { UserController } from '@/modules/users/user.controller';
import { RequestHandler } from 'express';

export interface AppDependencies {
  repositories: {
    adminUser: AdminUserRepository;
  };
  services: {
    adminUser: AdminUserService;
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
