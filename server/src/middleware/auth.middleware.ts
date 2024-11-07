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
    console.log('Auth0 user: ', auth0User);
    if (!auth0User)
      return next(new AuthenticationError('Auth0 user data not available'));

    try {
      let user = await userService.findByAuth0Id(auth0User.sub);

      if (!user) {
        console.log('Creating new user for: ' + auth0User.sub);
        const newUser: CreateUserDTO = {
          auth0Id: auth0User.sub,
          username: auth0User.nickname || auth0User.name,
          email: auth0User.email,
        };

        user = await userService.createUser(newUser);
      }

      console.log('Linked user: ' + user);
      next();
    } catch (error) {
      next(error);
    }
  };
};
