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
  console.error('Error details:', err);

  // Handle known errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  } else {
    // Handle uknown errors
    res.status(500).json({
      status: 'error',
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err.message,
    });
  }
};
