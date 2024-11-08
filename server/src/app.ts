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
import { devAuthBypass, linkAuth0User } from './middleware/auth.middleware';

export function createApp(
  userController: UserController,
  userService: UserService,
  expenseController: ExpenseController
) {
  const app = express();
  // Middleware
  app.use(auth(authConfig));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(linkAuth0User(userService));

  app.use(devAuthBypass); // Toggle to test authentication properly

  // Public routes
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });
  // Private Routes
  app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });
  app.use('/api/users', requiresAuth(), createUserRouter(userController));
  app.use(
    '/api/expenses',
    requiresAuth(),
    createExpenseRouter(expenseController)
  );
  // Error Handler
  app.use(errorHandler);
  return app;
}

// Dependencies
const { userController, userService, expenseController } =
  initializeDependencies();
const app = createApp(userController, userService, expenseController);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
