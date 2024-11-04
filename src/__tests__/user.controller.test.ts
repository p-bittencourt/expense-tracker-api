import request from 'supertest';
import { createApp } from '@/app';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.services';
import { UserController } from '@/modules/users/user.controller';
import type { IUser } from '@/modules/users/user.model';
import { CreateUserDTO } from '@/modules/users/user.dto';

// Mock the UserRepository and UserService
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.services');

// Sample mock user data
// const mockUser: Partial<IUser> = {
//   _id: '507f1f77bcf86cd799439011',
//   username: 'John Doe',
//   password: '1234',
//   email: 'john@example.com',
//   expenses: [],
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

describe('User Controller', () => {
  let app: any;
  let server: any;
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

    // Start the server
    server = app.listen(3001);
  });

  afterAll((done) => {
    // Clean up the server
    server.close(done);
  });

  beforeEach(() => {
    // clear all mock data before each test
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should retrieve an array of users', async () => {
      mockUserService.getAllUsers = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 when user is not found', async () => {
      // Mock the getUserById method to return null
      mockUserService.getUserById = jest.fn().mockResolvedValue(null);

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
      mockUserService.getUserById = jest.fn().mockResolvedValue(null);

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
        username: 'John Doe',
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
    it('should return 201 when user is successfully added', async () => {
      const newUser: CreateUserDTO = {
        username: 'John Doe',
        email: 'john@example.com',
        password: '1234',
      };

      const mockUser: Partial<IUser> = {
        _id: '507f1f77bcf86cd799439011',
        username: 'John Doe',
        email: 'john@example.com',
        expenses: [],
      };

      mockUserService.createUser = jest
        .fn()
        .mockResolvedValue(mockUser as IUser);

      const response = await request(app).post('/api/users/').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
    });
  });

  // it('should retrieve an array of users', (done) => {
  //   request(app)
  //     .get('/api/users')
  //     .then((response) => {
  //       expect(response.status).toBe(200);
  //       expect(response.body).toBeInstanceOf(Array);
  //       done();
  //     });
  // });
});
