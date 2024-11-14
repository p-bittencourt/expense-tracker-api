import { Router } from 'express';
import { UserController } from './user.controller';

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/', userController.home);
  router.get('/expenses', userController.getUserExpenses);

  return router;
};
