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

export class NotImplementedError extends AppError {
  constructor(message: string) {
    super(500, 'not_implemented', message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(400, 'authentication_error', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(403, 'forbidden_error', message);
  }
}

// TODO: check appropriate codes for NotImplementedError and AuthenticationError

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'not_found', message);
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
