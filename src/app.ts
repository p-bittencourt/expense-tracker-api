import express from 'express';
import connectDB from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.services';
import { UserRepository } from './modules/users/user.repository';

export function createApp(userService: UserService) {
  connectDB();
  const app = express();
  // Middleware
  app.use(express.json());

  const userController = new UserController(userService);
  // Routes
  app.use('/api/users', createUserRouter(userController));

  // Error Handler
  app.use(errorHandler);
  return app;
}

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const app = createApp(userService);
export default app;
