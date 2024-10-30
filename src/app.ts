import express from 'express';
import connectDB from './config/database';
import { errorHandler } from './middleware/error.middleware';
import { createUserRouter } from './modules/users/user.routes';
import { UserController } from './modules/users/user.controller';
import { UserService } from './modules/users/user.services';
import { UserRepository } from './modules/users/user.repository';

connectDB();
const app = express();

// Middleware
app.use(express.json());

// Dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
app.use('/api/users', createUserRouter(userController));

// Error Handler
app.use(errorHandler);

export default app;
