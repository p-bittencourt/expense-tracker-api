import { Router } from 'express';
import { UserController } from './user.controller';
import {
  validateObjectId,
  validateDTO,
} from '@/middleware/validation.middleware';

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/', userController.getAllUsers);
  router.get('/:id', validateObjectId, userController.getSingleUser);
  router.post('/', userController.createUser);

  return router;
};
