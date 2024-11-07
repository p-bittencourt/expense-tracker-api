import express from 'express';
import connectDB from './config/database';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.service';
import { UserRepository } from './modules/users/user.repository';
import { ExpenseRepository } from './modules/expenses/expense.repository';
import { ExpenseService } from './modules/expenses/expense.service';
import { ExpenseController } from './modules/expenses/expense.controller';
import { createExpenseRouter } from './modules/expenses/expense.routes';
import { auth, requiresAuth } from 'express-openid-connect';
import { linkAuth0User } from './middleware/auth.middleware';

export function createApp(
  userController: UserController,
  userService: UserService,
  expenseController: ExpenseController
) {
  const app = express();
  const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:5000',
    secret: process.env.SECRET,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  };

  // Middleware
  app.use(auth(config));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(linkAuth0User(userService));

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
export function initializeDependencies() {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  const expenseRepository = new ExpenseRepository();
  const expenseService = new ExpenseService(expenseRepository, userRepository);
  const expenseController = new ExpenseController(expenseService);

  return { userController, userService, expenseController };
}

const { userController, userService, expenseController } =
  initializeDependencies();
const app = createApp(userController, userService, expenseController);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
