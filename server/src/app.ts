import express, { Application } from 'express';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { devAuthBypass, linkAuth0User } from './middleware/auth.middleware';
import { AppDependencies } from './types/app.dependencies';
import { createMiddleware } from './config/middleware.config';
import { createRoutes } from './config/routes.config';

export function createApp(dependencies: AppDependencies): Application {
  const app = express();
  const middleware = createMiddleware(dependencies);

  // Global middleware
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(middleware.auth());
  app.use(linkAuth0User(dependencies.services.adminUser));

  app.use(devAuthBypass); // toggle to activate or disactivate

  // Apply routes
  createRoutes(app, dependencies, middleware);

  app.use(errorHandler);

  return app;
}
