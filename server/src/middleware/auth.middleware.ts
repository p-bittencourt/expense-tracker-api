import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/users/user.service';
import { CreateUserDTO } from '@/modules/users/user.dto';
import { UnauthorizedError } from '@/types/errors';

export const linkAuth0User = (userService: UserService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.oidc.isAuthenticated()) {
      return next();
    }

    const auth0User = req.oidc.user;
    if (!auth0User)
      return next(new UnauthorizedError('Auth0 user data not available'));

    try {
      let user = await userService.findByAuth0Id(auth0User.sub);

      if (!user) {
        const newUser: CreateUserDTO = {
          auth0Id: auth0User.sub,
          username: auth0User.nickname || auth0User.name,
          email: auth0User.email,
        };
        user = await userService.createUser(newUser);
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
