import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationError } from '@/types/errors';

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ValidationError('Invalid ID format'));
  }
  next();
};

export const validateDTO = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log('calls validation dto');
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new ValidationError('Request body is required'));
    }

    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const formattedErrors = errors
        .map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
          return `${error.property} : ${constraints.join(', ')}`;
        })
        .join('; ');
      return next(new ValidationError(`${formattedErrors}`));
    }

    req.body = dtoObject;
    next();
  };
};

export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.is('application/json')) {
    return next(new ValidationError('Content-Type must be application/json'));
  }
  next();
};

export const sanitizeUserInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.username) {
    req.body.username = req.body.username.trim();
  }
  if (req.body.email) {
    req.body.email = req.body.email.trim().toLowerCase();
  }
  next();
};
