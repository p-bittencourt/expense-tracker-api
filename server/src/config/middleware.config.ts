import { AppDependencies } from '@/types/app.dependencies';
import { auth } from 'express-openid-connect';
import { authConfig } from './auth0';
import {
  attachCurrentUser,
  checkUserRole,
  devAuthBypass,
  mockAttachCurrentUser,
  mockAuth,
  mockCheckUserRole,
} from '@/middleware/auth.middleware';

export const createMiddleware = (deps: AppDependencies) => ({
  auth:
    process.env.NODE_ENV === 'test' ? () => mockAuth : () => auth(authConfig),
  checkUserRole:
    process.env.NODE_ENV === 'test'
      ? mockCheckUserRole
      : () => checkUserRole(deps.services.adminUser),
  attachCurrentUser:
    process.env.NODE_ENV === 'test'
      ? mockAttachCurrentUser
      : () => attachCurrentUser(deps.repositories.adminUser),
  // devAuthBypass: process.env.NODE_ENV === 'development' ? devAuthBypass : undefined,
});
