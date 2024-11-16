import { createApp } from './app';
import connectDB from './config/database';
import { initializeDependencies } from './config/dependencies';
import { attachTestUser } from './middleware/auth.middleware';

const dependencies = initializeDependencies();

const app = createApp({
  repositories: {
    adminUser: dependencies.adminUserRepository,
  },
  services: {
    adminUser: dependencies.adminUserService,
    user: dependencies.userService,
    expense: dependencies.expenseService,
  },
  controllers: {
    adminUser: dependencies.adminUserController,
    user: dependencies.userController,
    expense: dependencies.expenseController,
  },

  // Activate for manual testing
  // middleware: {
  //   attachCurrentUser: () => attachTestUser(dependencies.adminUserRepository),
  // },
});

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
