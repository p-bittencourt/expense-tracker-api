import { Router } from 'express';
import { UserController } from './user.controller';
import {
  validateObjectId,
  validateDTO,
  validateContentType,
  sanitizeUserInput,
} from '@/middleware/validation.middleware';
import { CreateUserDTO } from './user.dto';

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/', userController.getAllUsers);
  router.get('/:id', validateObjectId, userController.getUserById);
  router.post(
    '/',
    validateContentType,
    sanitizeUserInput,
    validateDTO(CreateUserDTO),
    userController.createUser
  );
  router.delete('/:id', validateObjectId, userController.deleteUser);

  return router;
};
