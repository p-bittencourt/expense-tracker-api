import { Router } from 'express';
import { AdminUserController } from './admin.controller';
import {
  validateObjectId,
  validateDTO,
  validateContentType,
  sanitizeUserInput,
} from '@/middleware/validation.middleware';
import { CreateUserDTO, UpdateUserDTO } from '../users/user.dto';

export const createAdminUserRouter = (
  adminUserController: AdminUserController
) => {
  const router = Router();

  router.get('/me', adminUserController.getCurrentUser);

  router.get('/', adminUserController.getAllUsers);
  router.get('/:id', validateObjectId, adminUserController.getUserById);
  router.post(
    '/',
    validateContentType,
    sanitizeUserInput,
    validateDTO(CreateUserDTO),
    adminUserController.createUser
  );
  router.delete('/:id', validateObjectId, adminUserController.deleteUser);
  router.patch(
    '/:id',
    validateContentType,
    sanitizeUserInput,
    validateDTO(UpdateUserDTO),
    adminUserController.updateUser
  );

  return router;
};
