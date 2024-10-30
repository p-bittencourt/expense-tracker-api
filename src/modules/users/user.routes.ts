import { Router } from 'express';
import { UserController } from './user.controller';

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/', userController.getAllUsers);

  return router;
};
