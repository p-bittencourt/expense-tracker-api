import express from 'express';
import connectDB from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.service';
import { UserRepository } from './modules/users/user.repository';
import { ExpenseRepository } from './modules/expenses/expense.repository';
import { ExpenseService } from './modules/expenses/expense.service';
import { ExpenseController } from './modules/expenses/expense.controller';
import { createExpenseRouter } from './modules/expenses/expense.routes';

export function createApp(
  userController: UserController,
  expenseController: ExpenseController
) {
  const app = express();
  // Middleware
  app.use(express.json());

  // Routes
  app.use('/api/users', createUserRouter(userController));
  app.use('/api/expenses', createExpenseRouter(expenseController));

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

  return { userController, expenseController };
}

const { userController, expenseController } = initializeDependencies();
const app = createApp(userController, expenseController);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
