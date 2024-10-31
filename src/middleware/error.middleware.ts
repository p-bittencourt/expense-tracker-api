import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '@/types/errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // LOG ERROR FOR DEBUGGING,
  // use proper logging service in production
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle known errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Handle Mongoose/MongoDB specific errors
  if (err.name === 'MongoServerError') {
    const mongoError = err as any;

    // Duplicate key error
    if (mongoError.code === 11000) {
      const field = Object.keys(mongoError.keyPattern)[0];
      res.status(409).json({
        status: 'conflic_error',
        message: `A user with this ${field} already exists`,
        field: field,
      });
      return;
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'validation_error',
      message: 'Invalid input data',
      errors: err.message,
    });
    return;
  }

  // Handle uknown errors
  res.status(500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
};
