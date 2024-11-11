import express from 'express';
import morgan from 'morgan';
import connectDB from './config/database';
import { authConfig } from './config/auth0';
import { initializeDependencies } from './config/dependencies';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { ExpenseController } from './modules/expenses/expense.controller';
import { createExpenseRouter } from './modules/expenses/expense.routes';
import { auth, requiresAuth } from 'express-openid-connect';
import {
  attachCurrentUser,
  attachTestUser,
  checkUserRole,
  devAuthBypass,
  linkAuth0User,
} from './middleware/auth.middleware';
import { AdminUserController } from './modules/admin/admin.controller';
import { AdminUserService } from './modules/admin/admin.service';
import { createAdminUserRouter } from './modules/admin/admin.routes';
import { AdminUserRepository } from './modules/admin/admin.repository';

export function createApp(
  adminUserRepository: AdminUserRepository,
  adminUserController: AdminUserController,
  adminUserService: AdminUserService,
  userController: UserController,
  expenseController: ExpenseController,
  getAuthMiddleware = () => auth(authConfig),
  getCheckUserRole = () => checkUserRole(adminUserService),
  getAttachCurrentUser = () => attachCurrentUser(adminUserRepository)
) {
  const app = express();
  // Middleware
  app.use(getAuthMiddleware());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(linkAuth0User(adminUserService));
  // Toggle to test authentication properly, when active supplies test-user data to allow postman requests
  app.use(devAuthBypass);
  app.use(getAttachCurrentUser());

  // Public routes
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });
  // Private Routes
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
  app.use(
    '/home',
    // requiresAuth(), // comment out for testing
    getAttachCurrentUser(),
    createUserRouter(userController)
  );
  app.use(
    '/api/v1/admin',
    // requiresAuth(), // comment out for testing
    getCheckUserRole(),
    createAdminUserRouter(adminUserController)
  );
  app.use(
    '/api/v1/expenses',
    requiresAuth(),
    getAttachCurrentUser(),
    createExpenseRouter(expenseController)
  );
  // Error Handler
  app.use(errorHandler);
  return app;
}

// Dependencies
const {
  adminUserRepository,
  adminUserController,
  adminUserService,
  userController,
  expenseController,
} = initializeDependencies();
const app = createApp(
  adminUserRepository,
  adminUserController,
  adminUserService,
  userController,
  expenseController,
  undefined,
  undefined,
  () => attachTestUser(adminUserRepository)
);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
