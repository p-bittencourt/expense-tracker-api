import { Request, Response, NextFunction } from 'express';

export class IDValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IDValidationError';
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof IDValidationError) {
    res.status(400).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: 'Internal Server Error' });
};
