import { ConflictError, DatabaseError } from '@/types/errors';

export function handleDatabaseError(error: any, operation: string): never {
  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});
    throw new ConflictError(
      `A user with this ${fields.join(', ')} already exists`
    );
  }
  // Log uknown error for debugging and monitoring
  console.error('Database error:', {
    timestamp: new Date().toISOString(),
    operation,
    errorType: error instanceof Error ? error.constructor.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  throw new DatabaseError(`An error occurred during ${operation}`);
}
