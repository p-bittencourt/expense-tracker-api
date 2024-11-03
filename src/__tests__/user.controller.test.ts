import request from 'supertest';
import app from '@/app';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.services';
import { UserController } from '@/modules/users/user.controller';
import type { IUser } from '@/modules/users/user.model';

// Mock the UserRepository and UserService
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.services');

// Create mock repository instance
const MockUserRepository = UserRepository as jest.Mock<UserRepository>;
const MockUserService = UserService as jest.Mock<UserService>;

// Sample mock user data
const mockUser: Partial<IUser> = {
  _id: '507f1f77bcf86cd799439011',
  username: 'John Doe',
  password: '1234',
  email: 'john@example.com',
  expenses: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

let server: any;

beforeAll(() => {
  server = app.listen(3001); // Start the server on a different port for testing
});

afterAll((done) => {
  server.close(done); // Close the server after tests are done
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

describe('User Controller', () => {
  describe('GET /api/users/:id', () => {
    it('should return 404 when user is not found', async () => {
      const mockUserRepository =
        new MockUserRepository() as jest.Mocked<UserRepository>;
      const mockUserService = new MockUserService(
        mockUserRepository
      ) as jest.Mocked<UserService>;
      const mockUserController = new UserController(
        mockUserService
      ) as jest.Mocked<UserController>;

      // Mock the getUserById method
      mockUserService.getUserById.mockResolvedValueOnce(mockUser as IUser);

      const response = await request(app).get(`/api/users/${mockUser._id}`);

      expect(response.status).toBe(404);
      expect(mockUserService.getUserById).toHaveBeenCalled();
    });

    // it('should retrieve a user when a valid ID is provided', async () => {});
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
  //
  // it('should return 400 for invalid ID format', (done) => {
  //   request(app)
  //     .get('/api/users/invalid-id')
  //     .then((response) => {
  //       expect(response.status).toBe(400);
  //       expect(response.body).toEqual({
  //         message: 'Invalid ID format',
  //         status: 'validation_error',
  //       });
  //       done();
  //     });
  // });
  //
  // it('should retrieve');
});
