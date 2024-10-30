import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { IDValidationError } from './error.middleware';

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
