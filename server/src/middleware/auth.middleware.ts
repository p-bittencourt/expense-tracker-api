import { Request, Response, NextFunction } from 'express';
import { UserService } from '@/modules/users/user.service';
import { CreateUserDTO } from '@/modules/users/user.dto';
import { AuthenticationError } from '@/types/errors';

export const linkAuth0User = (userService: UserService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.oidc.isAuthenticated()) {
      return next();
    }

    const auth0User = req.oidc.user;

    if (!auth0User)
      return new AuthenticationError('Auth0 user data not available');

    try {
      const user = await userService.findByAuth0Id(auth0User.sub);

      if (!user) {
        const newUser: CreateUserDTO = {
          auth0Id: auth0User.sub,
          username: auth0User.nickname || auth0User.name,
          email: auth0User.email,
        };
      }
    } catch (error) {
      next(error);
    }
  };
};
