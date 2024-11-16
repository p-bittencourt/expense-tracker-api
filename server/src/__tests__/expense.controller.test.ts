import request from 'supertest';
import { Application } from 'express';
import { createTestApp, setupTestEnvironment } from './utils/setup';
import { createTestDependencies } from './utils/factories';
import { NotFoundError, ValidationError } from '@/types/errors';
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
    it('should return validation error with wrong cost type', async () => {
      // Debug route registration
      console.log(
        'Routes:',
        (app as any)._router.stack
          .filter((r: any) => r.route || r.name === 'router')
          .map((r: any) => ({
            path: r.regexp?.toString(),
            name: r.name,
            handle: r.handle?.name,
          }))
      );

      const createExpenseSpy = jest.spyOn(
        dependencies.services.expense,
        'createExpense'
      );

      // Add request logging
      const response = await request(app)
        .post('/api/v1/expenses')
        .send({})
        .expect(400); // Change to 400 for validation error

      console.log('Response:', {
        status: response.status,
        body: response.body,
        user: response.body?.user,
      });

      expect(response.body).toHaveProperty('status', 'error');
      expect(createExpenseSpy).not.toHaveBeenCalled();
    });

    it('should create an expense successfully', async () => {
      const mockExpenseData = {
        title: 'Test Expense',
        cost: 100,
        type: 'FOOD',
      };

      const response = await request(app)
        .post('/api/v1/expenses')
        .send(mockExpenseData)
        .expect(201);

      expect(response.body).toHaveProperty('expense');
      expect(response.body.expense.title).toBe(mockExpenseData.title);
    });
  });
});
