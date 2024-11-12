import { createApp } from './app';
import connectDB from './config/database';
import { initializeDependencies } from './config/dependencies';
import { attachTestUser } from './middleware/auth.middleware';

const dependencies = initializeDependencies();

const app = createApp({
  repositories: {
    adminUser: dependencies.adminUserRepository,
  },
  controllers: {
    adminUser: dependencies.adminUserController,
    user: dependencies.userController,
    expense: dependencies.expenseController,
  },
  services: {
    adminUser: dependencies.adminUserService,
  },

  // Override middleware for testing
  //middleware: process.env.NODE_ENV === 'test' ? {
  //  attachCurrentUser: () => attachTestUser(dependencies.adminUserRepository)
  //} : undefined,

  // Activate for manual testing
  // middleware: {
  //   attachCurrentUser: () => attachTestUser(dependencies.adminUserRepository),
  // },
});

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;