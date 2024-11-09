import request from 'supertest';
import { createApp } from '@/app';
import { AdminUserRepository } from '@/modules/admin/admin.repository';
import { AdminUserService } from '@/modules/admin/admin.service';
import { AdminUserController } from '@/modules/admin/admin.controller';
import type { IUser } from '@/modules/users/user.model';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UserResponseDTO,
} from '@/modules/users/user.dto';
import { NotFoundError } from '@/types/errors';
import type { Express } from 'express';
import mongoose from 'mongoose';
import { ExpenseRepository } from '@/modules/expenses/expense.repository';
import { ExpenseService } from '@/modules/expenses/expense.service';
import { ExpenseController } from '@/modules/expenses/expense.controller';
import { mockAuth, mockCheckUserRole } from '@/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/user.repository';

// Mock the UserRepository and UserService
jest.mock('@/modules/admin/admin.repository');
jest.mock('@/modules/admin/admin.service');
jest.mock('@/modules/expenses/expense.repository');
jest.mock('@/modules/expenses/expense.service');

describe('AdminUser Controller', () => {
  let app: Express;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAdminUserRepository: jest.Mocked<AdminUserRepository>;
  let mockAdminUserService: jest.Mocked<AdminUserService>;
  let mockExpenseRepository: jest.Mocked<ExpenseRepository>;
  let mockExpenseService: jest.Mocked<ExpenseService>;
  let adminUserController: AdminUserController;
  let expenseController: ExpenseController;

  beforeAll(() => {
    // Create our mock instances
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockAdminUserRepository =
      new AdminUserRepository() as jest.Mocked<AdminUserRepository>;
    mockAdminUserService = new AdminUserService(
      mockAdminUserRepository
    ) as jest.Mocked<AdminUserService>;
    mockExpenseRepository =
      new ExpenseRepository() as jest.Mocked<ExpenseRepository>;
    mockExpenseService = new ExpenseService(
      mockExpenseRepository,
      mockUserRepository
    ) as jest.Mocked<ExpenseService>;
    adminUserController = new AdminUserController(mockAdminUserService);
    expenseController = new ExpenseController(mockExpenseService);
    // Create the app with our mocked controllers
    app = createApp(
      adminUserController,
      mockAdminUserService,
      expenseController,
      () => mockAuth,
      mockCheckUserRole
    );
    // Mock console.error to suppress error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(async () => {
    // Restore console.error after testso
    jest.spyOn(console, 'error').mockRestore();
    await mongoose.connection.close();
  });

  beforeEach(() => {
    // clear all mock data before each test
    jest.clearAllMocks();
  });

  describe('GET /api/v1/users', () => {
    // TODO: refactor get tests to use supertest's .expect()
    it('should retrieve an array of users', async () => {
      mockAdminUserService.getAllUsers = jest.fn().mockResolvedValue([]);

      await request(app)
        .get('/api/v1/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return 404 when user is not found', async () => {
      mockAdminUserService.getUserById = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .get('/api/v1/users/507f1f77bcf86cd799439011')
        .expect(404)
        .expect((res) => {
          expect(mockAdminUserService.getUserById).toHaveBeenCalled();
          expect(res.body).toEqual({
            message: 'User not found',
            status: 'not_found',
          });
        });
    });

    it('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/api/v1/users/invalid-id')
        .expect(400)
        .expect((res) => {
          expect(res.body).toEqual({
            message: 'Invalid ID format',
            status: 'validation_error',
          });
        });
    });

    it('should return a user when found', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        username: 'JohnDoe',
        email: 'john@example.com',
        expenses: [],
      };

      mockAdminUserService.getUserById = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      await request(app)
        .get('/api/v1/users/507f1f77bcf86cd799439011')
        .expect(200)
        .expect((res) => {
          expect(mockAdminUserService.getUserById).toHaveBeenCalled();
          expect(res.body).toEqual(mockUser);
        });
    });
  });

  describe('POST /api/v1/users', () => {
    const validUser: CreateUserDTO = {
      auth0Id: 'auth0|1234567890',
      username: 'JohnDoe',
      email: 'john@example.com',
    };

    it('should return 201 when user is successfully created', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        auth0Id: 'auth0|1234567890',
        username: validUser.username,
        email: validUser.email,
        expenses: [],
      };

      mockAdminUserService.createUser = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      await request(app)
        .post('/api/v1/users')
        .send(validUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockUser);
          expect(mockAdminUserService.createUser).toHaveBeenCalledWith(
            validUser
          );
        });
    });

    it('should return 400 when request body is empty', async () => {
      await request(app)
        .post('/api/v1/users')
        .send({})
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'validation_error');
          expect(res.body.message).toContain('required');
        });
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteUser = {
        username: 'John Doe',
        // missing email
      };

      await request(app)
        .post('/api/v1/users')
        .send(incompleteUser)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'validation_error');
          expect(res.body.message).toContain('email');
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should return 404 NotFoundError if user not found', async () => {
      mockAdminUserService.deleteUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .delete('/api/v1/users/507f1f77bcf86cd799439011')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should return 200 when successfully deleting the user', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        auth0Id: 'auth0|1234567890',
        username: 'janeDoe',
        email: 'janeDoe@email.com',
        expenses: [],
      };

      mockAdminUserService.deleteUser = jest.fn().mockResolvedValue(mockUser);

      await request(app)
        .delete('/api/v1/users/507f1f77bcf86cd799439011')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('user', mockUser);
          expect(res.body).toHaveProperty(
            'message',
            'User successfully deleted'
          );
        });
    });
  });

  describe('PATCH /api/v1/users/:id', () => {
    it('should successfully update an user', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        auth0Id: 'auth0|1234567890',
        username: 'janeDoe',
        email: 'janedoe@email.com',
        expenses: [],
      };
      mockAdminUserService.updateUser = jest.fn().mockResolvedValue(mockUser);

      await request(app)
        .patch('/api/v1/users/507f1f77bcf86cd799439011')
        .send({ email: 'janedoe@email.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toEqual(mockUser.email);
          expect(mockAdminUserService.updateUser).toHaveBeenCalled();
        });
    });

    it('should return 404 NotFoundError if user not found', async () => {
      mockAdminUserService.updateUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .patch('/api/v1/users/507f1f77bcf86cd799439011')
        .send({ email: 'test@email.com' })
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        })
        .expect(404);
    });
  });
});
