import express from 'express';
import connectDB from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.service';
import { UserRepository } from './modules/users/user.repository';

export function createApp(userController: UserController) {
  const app = express();
  // Middleware
  app.use(express.json());

  // Routes
  app.use('/api/users', createUserRouter(userController));

  // Error Handler
  app.use(errorHandler);
  return app;
}

// Dependencies
export function initializeDependencies() {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);
  return userController;
}

const userController = initializeDependencies();
const app = createApp(userController);

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

export default app;
