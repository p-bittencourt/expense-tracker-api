import request from 'supertest';
import { createApp } from '@/app';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.service';
import { UserController } from '@/modules/users/user.controller';
import type { IUser } from '@/modules/users/user.model';
import { CreateUserDTO } from '@/modules/users/user.dto';
import { NotFoundError } from '@/types/errors';
import type { Express } from 'express';

// Mock the UserRepository and UserService
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.services');

describe('User Controller', () => {
  let app: Express;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserService: jest.Mocked<UserService>;
  let userController: UserController;

  beforeAll(() => {
    // Create our mock instances
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockUserService = new UserService(
      mockUserRepository
    ) as jest.Mocked<UserService>;
    userController = new UserController(mockUserService);
    // Create the app with our mocked controller
    app = createApp(userController);
    // Mock console.error to suppress error logs during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after testso
    jest.spyOn(console, 'error').mockRestore();
  });

  beforeEach(() => {
    // clear all mock data before each test
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    // TODO: refactor get tests to use supertest's .expect()
    it('should retrieve an array of users', async () => {
      mockUserService.getAllUsers = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 when user is not found', async () => {
      mockUserService.getUserById = jest
        .fn()
        .mockRejectedValue(new NotFoundError('User not found'));

      const response = await request(app).get(
        '/api/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(404);
      expect(mockUserService.getUserById).toHaveBeenCalled();
      expect(response.body).toEqual({
        message: 'User not found',
        status: 'not_found',
      });
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/users/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid ID format',
        status: 'validation_error',
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

      const response = await request(app).get(
        '/api/users/507f1f77bcf86cd799439011'
      );

      expect(response.status).toBe(200);
      expect(mockUserService.getUserById).toHaveBeenCalled();
      expect(response.body).toEqual(mockUser);
    });
  });

  describe('POST /api/users', () => {
    const validUser: CreateUserDTO = {
      username: 'JohnDoe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should return 201 when user is successfully created', async () => {
      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
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
        // missing email and password
      };

      await request(app)
        .post('/api/users')
        .send(incompleteUser)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'validation_error');
          expect(res.body.message).toContain('email');
          expect(res.body.message).toContain('password');
        });
    });
  });
});
