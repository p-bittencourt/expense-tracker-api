import { Router } from 'express';
import { UserController } from './user.controller';
import {
  validateObjectId,
  validateDTO,
  validateContentType,
  sanitizeUserInput,
} from '@/middleware/validation.middleware';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';

export const createUserRouter = (userController: UserController) => {
  const router = Router();

  router.get('/me', userController.getCurrentUser);
  /*

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
  router.patch(
    '/:id',
    validateContentType,
    sanitizeUserInput,
    validateDTO(UpdateUserDTO),
    userController.editUser
  );

  */
  return router;
};
