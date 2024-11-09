import express from 'express';
import morgan from 'morgan';
import connectDB from './config/database';
import { authConfig } from './config/auth0';
import { initializeDependencies } from './config/dependencies';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.service';
import { ExpenseController } from './modules/expenses/expense.controller';
import { createExpenseRouter } from './modules/expenses/expense.routes';
import { auth, requiresAuth } from 'express-openid-connect';
import {
  checkUserRole,
  devAuthBypass,
  linkAuth0User,
} from './middleware/auth.middleware';
import { AdminUserController } from './modules/admin/admin.controller';
import { AdminUserService } from './modules/admin/admin.service';
import { createAdminUserRouter } from './modules/admin/admin.routes';

export function createApp(
  adminUserController: AdminUserController,
  adminUserService: AdminUserService,
  expenseController: ExpenseController,
  getAuthMiddleware = () => auth(authConfig),
  getCheckUserRole = () => checkUserRole(adminUserService)
) {
  const app = express();
  // Middleware
  app.use(getAuthMiddleware());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(linkAuth0User(adminUserService));

  // Toggle to test authentication properly, when active supplies test-user data to allow postman requests
  // app.use(devAuthBypass);

  // Public routes
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });
  // Private Routes
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
  app.use(
    '/api/v1/users',
    requiresAuth(),
    getCheckUserRole(),
    createAdminUserRouter(adminUserController)
  );
  app.use(
    '/api/v1/expenses',
    requiresAuth(),
    createExpenseRouter(expenseController)
  );
  // Error Handler
  app.use(errorHandler);
  return app;
}

// Dependencies
const { adminUserController, adminUserService, expenseController } =
  initializeDependencies();
const app = createApp(adminUserController, adminUserService, expenseController);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
