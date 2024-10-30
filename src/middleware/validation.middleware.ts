import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IDValidationError } from './error.middleware';
import { validate } from 'class-validator';

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new IDValidationError('Invalid ID format'));
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
      res.status(400).json({ errors: formattedErrors });
      return;
    }

    req.body = dtoObject;
    next();
  };
};
