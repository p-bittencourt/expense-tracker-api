import request from 'supertest';
import { createApp } from '@/app';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.service';
import { UserController } from '@/modules/users/user.controller';
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
import { mockAuth } from '@/middleware/auth.middleware';

// Mock the UserRepository and UserService
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.service');
jest.mock('@/modules/expenses/expense.repository');
jest.mock('@/modules/expenses/expense.service');

describe('User Controller', () => {
  let app: Express;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let mockExpenseRepository: jest.Mocked<ExpenseRepository>;
  let mockExpenseService: jest.Mocked<ExpenseService>;
  let userController: UserController;
  let expenseController: ExpenseController;

  beforeAll(() => {
    // Create our mock instances
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockUserService = new UserService(
      mockUserRepository
    ) as jest.Mocked<UserService>;
    mockExpenseRepository =
      new ExpenseRepository() as jest.Mocked<ExpenseRepository>;
    mockExpenseService = new ExpenseService(
      mockExpenseRepository,
      mockUserRepository
    ) as jest.Mocked<ExpenseService>;
    userController = new UserController(mockUserService);
    expenseController = new ExpenseController(mockExpenseService);
    // Create the app with our mocked controllers
    app = createApp(
      userController,
      mockUserService,
      expenseController,
      () => mockAuth
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

  describe('GET /api/users', () => {
    // TODO: refactor get tests to use supertest's .expect()
    it('should retrieve an array of users', async () => {
      mockUserService.getAllUsers = jest.fn().mockResolvedValue([]);

      await request(app)
        .get('/api/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 when user is not found', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .get('/api/users/507f1f77bcf86cd799439011')
        .expect(404)
        .expect((res) => {
          expect(mockUserService.getUserById).toHaveBeenCalled();
          expect(res.body).toEqual({
            message: 'User not found',
            status: 'not_found',
          });
        });
    });

    it('should return 400 for invalid ID format', async () => {
      await request(app)
        .get('/api/users/invalid-id')
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

      mockUserService.getUserById = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      await request(app)
        .get('/api/users/507f1f77bcf86cd799439011')
        .expect(200)
        .expect((res) => {
          expect(mockUserService.getUserById).toHaveBeenCalled();
          expect(res.body).toEqual(mockUser);
        });
    });
  });

  describe('POST /api/users', () => {
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

      mockUserService.createUser = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      await request(app)
        .post('/api/users')
        .send(validUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockUser);
          expect(mockUserService.createUser).toHaveBeenCalledWith(validUser);
        });
    });

    it('should return 400 when request body is empty', async () => {
      await request(app)
        .post('/api/users')
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
        .post('/api/users')
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
      mockUserService.deleteUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .delete('/api/users/507f1f77bcf86cd799439011')
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

      mockUserService.deleteUser = jest.fn().mockResolvedValue(mockUser);

      await request(app)
        .delete('/api/users/507f1f77bcf86cd799439011')
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

  describe('PATCH /api/users/:id', () => {
    it('should successfully update an user', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        auth0Id: 'auth0|1234567890',
        username: 'janeDoe',
        email: 'janedoe@email.com',
        expenses: [],
      };
      mockUserService.editUser = jest.fn().mockResolvedValue(mockUser);

      await request(app)
        .patch('/api/users/507f1f77bcf86cd799439011')
        .send({ email: 'janedoe@email.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toEqual(mockUser.email);
          expect(mockUserService.editUser).toHaveBeenCalled();
        });
    });

    it('should return 404 NotFoundError if user not found', async () => {
      mockUserService.editUser = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      await request(app)
        .patch('/api/users/507f1f77bcf86cd799439011')
        .send({ email: 'test@email.com' })
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
        })
        .expect(404);
    });
  });
});
