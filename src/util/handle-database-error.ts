import { ConflictError, DatabaseError } from '@/types/errors';

export function handleDatabaseError(error: any, operation: string): never {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern);
    throw new ConflictError(`A user with this ${field} already exists`);
  }
  // Log uknown error for debugging and monitoring
  console.error('Database error:', {
    operation,
    error: error.message,
    stack: error.stack,
  });

  throw new DatabaseError(`An error occurred during ${operation}`);
}
