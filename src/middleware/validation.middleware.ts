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
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      return next(new ValidationError(`${formattedErrors}`));
    }

    req.body = dtoObject;
    next();
  };
};
