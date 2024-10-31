export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    message: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'validation_error', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, 'conflict_error', message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(500, 'database_error', message);
  }
}
