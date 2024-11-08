enum HttpStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
}

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
    super(HttpStatus.NOT_IMPLEMENTED, 'not_implemented', message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(HttpStatus.UNAUTHORIZED, 'authentication_error', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(HttpStatus.FORBIDDEN, 'forbidden_error', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, 'not_found', message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(HttpStatus.BAD_REQUEST, 'validation_error', message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(HttpStatus.CONFLICT, 'conflict_error', message);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, 'database_error', message);
  }
}
