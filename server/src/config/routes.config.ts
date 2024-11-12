import { AppDependencies } from '@/types/app.dependencies';
import { createMiddleware } from './middleware.config';
import {
  Application,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';
import { createUserRouter } from '@/modules/users/user.routes';
import { createAdminUserRouter } from '@/modules/admin/admin.routes';
import { createExpenseRouter } from '@/modules/expenses/expense.routes';
import { requiresAuth } from 'express-openid-connect';

export const createRoutes = (
  app: Application,
  deps: AppDependencies,
  middleware: ReturnType<typeof createMiddleware>
) => {
  // Public routes
  app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

  // Authentication required routes
  const authRoutes = [
    {
      path: '/profile',
      handler: (req: Request, res: Response) => {
        res.send(JSON.stringify(req.oidc.user));
      },
    },
    {
      path: '/home',
      router: createUserRouter(deps.controllers.user),
      middleware: [middleware.attachCurrentUser()],
    },
    {
      path: '/api/v1/admin',
      router: createAdminUserRouter(deps.controllers.adminUser),
      middleware: [middleware.checkUserRole()],
    },
    {
      path: '/api/v1/expenses',
      router: createExpenseRouter(deps.controllers.expense),
      middleware: [middleware.attachCurrentUser()],
    },
  ];

  authRoutes.forEach(({ path, router, handler, middleware = [] }) => {
    const routeMiddleware = [requiresAuth(), ...middleware];
    if (router) {
      app.use(path, ...routeMiddleware, router);
    } else if (handler) {
      app.get(path, ...routeMiddleware, handler);
    }
  });
};
