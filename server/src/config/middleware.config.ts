import { AppDependencies } from '@/types/app.dependencies';
import { auth } from 'express-openid-connect';
import { authConfig } from './auth0';
import {
  attachCurrentUser,
  checkUserRole,
  devAuthBypass,
} from '@/middleware/auth.middleware';

export const createMiddleware = (deps: AppDependencies) => ({
  auth: () => auth(authConfig),
  checkUserRole: () => checkUserRole(deps.services.adminUser),
  attachCurrentUser: () => attachCurrentUser(deps.repositories.adminUser),
  // devAuthBypass: process.env.NODE_ENV === 'development' ? devAuthBypass : undefined,
});
