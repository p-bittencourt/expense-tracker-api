import { Request, Response, NextFunction } from 'express';
import { CreateUserDTO } from '@/modules/users/user.dto';
import { UnauthorizedError } from '@/types/errors';
import { Roles } from '@/modules/users/user.model';
import { AdminUserService } from '@/modules/admin/admin.service';

export const linkAuth0User = (adminUserService: AdminUserService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.oidc.isAuthenticated()) {
      return next();
    }

    const auth0User = req.oidc.user;
    if (!auth0User)
      return next(new UnauthorizedError('Auth0 user data not available'));

    try {
      let user = await adminUserService.getUserByAuth0Id(auth0User.sub);
      const allUsers = await adminUserService.getAllUsers();

      if (!user) {
        const newUser: CreateUserDTO = {
          auth0Id: auth0User.sub,
          username: auth0User.nickname || auth0User.name,
          email: auth0User.email,
          role: allUsers.length < 1 ? Roles.ADMIN : Roles.USER,
        };
        user = await adminUserService.createUser(newUser);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export function devAuthBypass(req: Request, res: Response, next: NextFunction) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'auth0|672cb540fd0903177515f320',
        email: 'email@example.com',
      },
      fetchUserInfo: async () => ({
        sub: 'auth0|672cb540fd0903177515f320',
        email: 'email@example.com',
      }),
    };
    next();
  }
}

export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  // Mock an authenticated user object
  req.oidc = {
    isAuthenticated: () => true,
    user: {
      sub: 'auth0|672cb540fd0903177515f320',
      email: 'email@example.com',
    },
    fetchUserInfo: async () => ({
      sub: 'auth0|672cb540fd0903177515f320',
      email: 'email@example.com',
    }),
  };
  next();
};

export const checkUserRole = (adminUserService: AdminUserService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('in check user role');
    const auth0User = req.oidc.user;
    if (!auth0User)
      return next(new UnauthorizedError('Auth0 user data not available'));

    const user = await adminUserService.getUserByAuth0Id(auth0User.sub);
    if (!user || user.role != 'ADMIN')
      return next(new UnauthorizedError('Admin only'));

    next();
  };
};

export const mockCheckUserRole = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};
