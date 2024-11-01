import request from 'supertest';
import app from '@/app';
import { UserRepository } from '@/modules/users/user.repository';
import { UserService } from '@/modules/users/user.services';
import type { IUser } from '@/modules/users/user.model';

// Mock the UserRepository and UserService
jest.mock('@/modules/users/user.repository');
jest.mock('@/modules/users/user.services');

// Create mock repository instance
const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
};

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

// Setup UserService with a mock implementation using the mockUserRepository
(UserService as jest.Mock).mockImplementation(() => ({
  getUserById: jest.fn((id: string) => (id === mockUser._id ? mockUser : null)),
  getAllUsers: jest.fn(),
  createUser: jest.fn(),
  userRepository: mockUserRepository as unknown as UserRepository, // Attach mock repository
}));

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
    it('should retrieve a user when a valid ID is provided', async () => {
      const userService = new UserService(
        mockUserRepository as unknown as UserRepository
      );
      (userService.getUserById as jest.Mock).mockResolvedValueOnce(mockUser);
      const response = await request(app).get(`/api/users/${mockUser._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        expenses: [],
        createdAt: mockUser.createdAt!.toISOString(),
        updatedAt: mockUser.updatedAt!.toISOString(),
      });
      expect(userService.getUserById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should return 404 when user is not found', async () => {
      const userService = new UserService(
        mockUserRepository as unknown as UserRepository
      );
      (userService.getUserById as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app).get(
        '/api/users/507f1f77bcf86cd799439012'
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'User not found',
        status: 'not_found',
      });
      expect(userService.getUserById).toHaveBeenCalled();
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
