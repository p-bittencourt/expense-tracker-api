import request from 'supertest';
import { Application } from 'express';
import { createTestApp, setupTestEnvironment } from './utils/setup';
import { createTestDependencies } from './utils/factories';
import { NotFoundError } from '@/types/errors';
import { MOCKS } from './utils/mocks';

describe('ExpenseTracker - User / Expense Controller', () => {
  let app: Application;
  let dependencies: ReturnType<typeof createTestDependencies>;

  setupTestEnvironment();

  beforeAll(() => {
    dependencies = createTestDependencies();
    app = createTestApp(dependencies);
  });

  describe('POST /api/v1/expenses', () => {
    it('should return validation error with wrong cost type', () => {});
    it('should return the created expense and the associated user', () => {});
  });
});
